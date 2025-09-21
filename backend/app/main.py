import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from fastapi.middleware.cors import CORSMiddleware
import random
import os
from dotenv import load_dotenv
from google import genai
from geopy.geocoders import Nominatim

app = FastAPI()
load_dotenv()
api_key = os.getenv("API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables")
client = genai.Client(api_key=api_key)

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://your-frontend.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# In-memory storage
ideas_db = {}
feedback_db = {}
idea_counter = 1

@app.get("/")
async def connectionCheck():
    return "Connection Successful"

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
    num_personas = random.randint(2, 5)
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

    feedback_db[idea_id] = feedback_list

    # Prepare Gemini prompt
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
  "jobIndustry": "Defense",
  "city": "Toronto",
  "country": "Canada",
  "age": 29,
  "gender": "Male",
  "sentimentScore": "35.4"
}}'''

    # Call Gemini API
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    # Parse the JSON string returned by Gemini
    try:
        response_data = json.loads(response.text)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse Gemini API response")

    # Geocode the city and country
    geolocator = Nominatim(user_agent="geoapi")
    city = response_data.get("city")
    country = response_data.get("country")
    location = geolocator.geocode(f"{city}, {country}")

    if location:
        response_data["latitude"] = location.latitude
        response_data["longitude"] = location.longitude
    else:
        response_data["latitude"] = None
        response_data["longitude"] = None

    return {"status": "success", "idea_id": idea_id, "message": response_data}


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
