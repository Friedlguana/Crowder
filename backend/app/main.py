from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import random

app = FastAPI()

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
    
    feedback_db[idea_id] = feedback_list

    return {"status": "success", "idea_id": idea_id, "message": "Idea submitted successfully. Feedback generated."}

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
