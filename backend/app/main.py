import json
import os
import random
from fastapi import FastAPI, Depends, HTTPException, Header
from pydantic import BaseModel
from typing import List, Dict
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google import genai
from geopy.geocoders import Nominatim
import firebase_admin
from firebase_admin import credentials, firestore, auth
import jwt
import datetime
from fastapi import Body, Path
import traceback


# ----------------------------
# Setup
# ----------------------------
app = FastAPI()
load_dotenv()
cred = credentials.Certificate("./crowder-e26dc-firebase-adminsdk-fbsvc-111b4a2222.json")
firebase_admin.initialize_app(cred)
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()

# Load Gemini API keys
gemini_api_keys = [
    os.getenv("GEMINI_API_KEY_1"),
    os.getenv("GEMINI_API_KEY_2"),
    os.getenv("GEMINI_API_KEY_3"),
    os.getenv("GEMINI_API_KEY_4"),
    os.getenv("GEMINI_API_KEY_5"),
    os.getenv("GEMINI_API_KEY_6"),
]

if not all(gemini_api_keys):
    raise ValueError("One or more GEMINI_API_KEY_X are missing in environment variables")

# Create clients for each API key
gemini_clients = [genai.Client(api_key=key) for key in gemini_api_keys]
current_key_index = 0

# CORS
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

#function for safe json parsing
import re

def safe_json_load(text: str):
    # Remove wrapping quotes if needed
    text = text.strip()
    if text.startswith('"') and text.endswith('"'):
        text = text[1:-1].replace('\\"', '"')
    # Extract first JSON object
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        return json.loads(match.group())
    raise ValueError("No JSON found")


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

class SignupRequest(BaseModel):
    username: str
    email: str
    password: str  # SHA-256 hashed

class LoginRequest(BaseModel):
    email: str
    password: str  # SHA-256 hashed from frontend

# ----------------------------
# In-memory storage
# ----------------------------
ideas_db = {}
feedback_db = {}
idea_counter = 1

@app.get("/")
async def connectionCheck():
    return "Connection Successful"

# ----------------------------
# Utility function: LLM handler
# ----------------------------
def generate_llm_response(prompt: str):
    """Cycle through multiple Gemini API keys if rate-limited"""
    global current_key_index

    attempts = 0
    while attempts < len(gemini_clients):
        client = gemini_clients[current_key_index]
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            return response.text, f"gemini_key_{current_key_index+1}"

        except Exception as e:
            if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                # Switch to next API key
                current_key_index = (current_key_index + 1) % len(gemini_clients)
                attempts += 1
                continue
            else:
                raise HTTPException(status_code=500, detail=f"Gemini error ({current_key_index+1}): {e}")

    raise HTTPException(status_code=500, detail="All Gemini API keys exhausted due to RPM limits")

# ----------------------------
# 1. Idea Submission
# ----------------------------
@app.post("/api/submitIdea")
async def idea_submission(submission: IdeaSubmission):
    global idea_counter
    idea_id = idea_counter
    ideas_db[idea_id] = submission.idea_text
    idea_counter += 1

    # Simulate personas
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

    # Prepare prompt
    prompt = f'''You are (name), who is a (jobTitle) living in (city), (country). 
You are (age) years old and a (gender). Review the following idea honestly.
Factor in the demographic that is provided to you while giving your opinion.
If the idea already exists or is implemented, the review must acknowledge it and be 
honest if the idea is going to pan out or no.
If the idea is bad or not good enough, it must be stated along with the reason.
If the idea is good or resonates with you, you should also state accordingly why.
The review shouldn't be more than 3 sentences.
Do not provide anything else but the output format that is requested.
Randomly generate the demographic details.

Idea: {submission.idea_text}

Output Format:
{{
  "review": "string",
  "name": "string",
  "jobTitle": "string",
  "jobIndustry": "string",
  "city": "string",
  "country": "string",
  "age": int,
  "gender": "string",
  "sentimentScore": "float"(out of 100)
}}
'''

    # Call LLM with key cycling
    llm_output, key_used = generate_llm_response(prompt)

    # Parse LLM output
    try:
        response_data = safe_json_load(llm_output)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail=f"Failed to parse {key_used} response")

    # Geocode
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

    return {"status": "success", "idea_id": idea_id, "provider": key_used, "message": response_data}

# ----------------------------
# 2. Get user details
# ----------------------------
def verify_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    id_token = authorization.split("Bearer ")[1]
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token["uid"]
        user = auth.get_user(uid)
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

@app.get("/get_user")
def get_user(user=Depends(verify_token)):
    return {
        "uid": user.uid,
        "email": user.email,
        "display_name": user.display_name,
        "phone_number": user.phone_number,
        "custom_claims": user.custom_claims,
    }


# -------------------------------
# Data Model for Project
# -------------------------------
class Project(BaseModel):
    project_name: str | None = None
    project_description: str | None = None
    avg_sim_perc: float | None = None
    no_sim: int | None = None
    sim_response: list[dict] = []

@app.post("/projects/new")
def create_project(uid: str = Depends(verify_token)):
    try:
        project_data = {
            "uid": uid,  # link to user
            "project_name": "",
            "project_description": "",
            "avg_sim_perc": None,
            "no_sim": None,
            "sim_response": [],
            "created_date": datetime.utcnow().isoformat()
        }

        # Add to Firestore (auto-generate doc id)
        doc_ref = db.collection("projects").add(project_data)

        return {
            "message": "Project created successfully",
            "project_id": doc_ref[1].id,
            "project": project_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# -------------------------------
# Update Project
# -------------------------------

# example frontend call

# const session = await getSession();

# await fetch(`http://127.0.0.1:8000/projects/${projectId}`, {
#   method: "PATCH",
#   headers: {
#     "Authorization": `Bearer ${session.token}`,
#     "Content-Type": "application/json"
#   },
#   body: JSON.stringify({
#     field_to_update: "project_name",
#     data: "Crowder Simulation Project"
#   })
# });

@app.patch("/projects/{project_id}")
def update_project(
    project_id: str = Path(...),
    payload: dict = Body(...),
    uid: str = Depends(verify_token)
):
    try:
        field = payload.get("field_to_update")
        data = payload.get("data")

        if not field:
            raise HTTPException(status_code=400, detail="field_to_update is required")

        # Get the project doc
        doc_ref = db.collection("projects").document(project_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail="Project not found")

        # Ensure user owns the project
        if doc.to_dict().get("uid") != uid:
            raise HTTPException(status_code=403, detail="Not authorized to update this project")

        # Update the field
        doc_ref.update({field: data})

        return {"message": f"Updated {field} successfully", "project_id": project_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------------
# Get all projects for a user
# -------------------------------


# example frontend call
# const session = await getSession();

# const res = await fetch("http://127.0.0.1:8000/projects", {
#   method: "GET",
#   headers: {
#     "Authorization": `Bearer ${session.token}`
#   }
# });

# const data = await res.json();
# console.log("User projects:", data.projects);



@app.get("/projects")
def get_user_projects(uid: str = Depends(verify_token)):
    try:
        projects_ref = db.collection("projects").where("uid", "==", uid).stream()

        projects = []
        for doc in projects_ref:
            project = doc.to_dict()
            project["id"] = doc.id  # include Firestore doc ID
            projects.append(project)

        return {"projects": projects}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    # response example
#     {
#   "projects": [
#     {
#       "id": "abc123",
#       "uid": "ESc42kzwwcPlPzEAqPCqtJ65pJu2",
#       "project_name": "Crowder Simulation Project",
#       "project_description": "Some description",
#       "avg_sim_perc": 85.4,
#       "no_sim": 10,
#       "sim_response": [],
#       "created_date": "2025-09-22T12:34:56.789Z"
#     },
#     {
#       "id": "xyz456",
#       "uid": "ESc42kzwwcPlPzEAqPCqtJ65pJu2",
#       "project_name": "",
#       "project_description": "",
#       "avg_sim_perc": null,
#       "no_sim": null,
#       "sim_response": [],
#       "created_date": "2025-09-21T08:10:11.123Z"
#     }
#   ]
# }
