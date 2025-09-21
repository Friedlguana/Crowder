from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from fastapi.middleware.cors import CORSMiddleware
import random
import os
from dotenv import load_dotenv
from google import genai

app = FastAPI()
load_dotenv()
api_key = os.getenv("API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables")
client = genai.Client(api_key=api_key)


origins = [
    "http://localhost:3000",   # React/Next.js local dev
    "http://localhost:5173",   # Vite local dev
    "https://your-frontend.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Allowed origins
    allow_credentials=True,
    allow_methods=["*"],              # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],              # Allow all headers
)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Crowder backend running"}

# ----------------------------
# Pydantic models
# ----------------------------
class IdeaSubmission(BaseModel):
    idea_text: str

class PersonaProfile(BaseModel):
    age: int
    location: str

class PersonaFeedback(BaseModel):
    persona_id: int
    persona_profile: PersonaProfile
    response_message: str

class FeedbackResponse(BaseModel):
    idea_id: int
    feedback: List[PersonaFeedback]

class DashboardResponse(BaseModel):
    idea_id: int
    summary_message: str
    persona_distribution: Dict[str, Dict[str, int]]

# ----------------------------
# In-memory storage (for MVP)
# ----------------------------
ideas_db = {}       # idea_id: idea_text
feedback_db = {}    # idea_id: list of PersonaFeedback
idea_counter = 1

# ----------------------------
# 1. Idea Submission
# ----------------------------
@app.post("/api/submitIdea")
async def idea_submission(submission: IdeaSubmission):
    global idea_counter
    idea_id = idea_counter
    ideas_db[idea_id] = submission.idea_text
    idea_counter += 1

    # Simulate AI feedback generation with variable number of personas
    num_personas = random.randint(2, 5)  # example: 2-5 personas
    feedback_list = []
    for pid in range(1, num_personas + 1):
        persona = PersonaFeedback(
            persona_id=pid,
            persona_profile=PersonaProfile(
                age=random.randint(18, 45),
                location=random.choice(["USA", "India", "UK", "Germany"])
            ),
            response_message=f"Persona {pid} simulated response for idea '{submission.idea_text}'."
        )
        feedback_list.append(persona)
    prompt = f'''You are (name), who is a (jobTitle) living in (city), (country). Your are (age) years old and
you are a (gender). I need you to give an honest review for the following Idea.
Factor in the demographic that is provided to you while giving your opinion. If the idea
is bad or not good enough, it must be stated along with the reason. If the idea is good or
resonates with you, you should also state accordingly why. The review shouldn't be more than 3 sentences.
Do not provide anything else but the output format that is requested.
Randomly generate the demographic details.

Idea: {submission.idea_text}

Output Format example:

{{
  "review": "abc",
  "name": "John Doe",
  "jobTitle": "Software Engineer",
  "city": "Toronto",
  "country": "Canada",
  "age": 29,
  "gender": "Male"
}}'''
    feedback_db[idea_id] = feedback_list
    response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=prompt,
)

    return {"status": "success", "idea_id": idea_id, "message": response}

# ----------------------------
# 2. Get Feedback
# ----------------------------
@app.get("/api/getFeedback")
async def get_feedback(idea_id: int):
    if idea_id not in feedback_db:
        raise HTTPException(status_code=404, detail="Idea not found")
    return FeedbackResponse(idea_id=idea_id, feedback=feedback_db[idea_id])

# ----------------------------
# 3. Get Dashboard Data
# ----------------------------
@app.get("/api/getDashboardData")
async def get_dashboard_data(idea_id: int):
    if idea_id not in feedback_db:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    feedback_list = feedback_db[idea_id]

    # Calculate persona distribution
    age_groups = {"18-25":0, "26-35":0, "36-45":0}
    locations = {}
    for f in feedback_list:
        age = f.persona_profile.age
        if 18 <= age <= 25: age_groups["18-25"] += 1
        elif 26 <= age <= 35: age_groups["26-35"] += 1
        elif 36 <= age <= 45: age_groups["36-45"] += 1

        loc = f.persona_profile.location
        locations[loc] = locations.get(loc, 0) + 1

    summary = "Average sentiment is positive. Most personas found the idea useful and engaging."

    return DashboardResponse(
        idea_id=idea_id,
        summary_message=summary,
        persona_distribution={"age_groups": age_groups, "locations": locations}
    )
