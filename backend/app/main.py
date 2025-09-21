import json
import os
import random
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google import genai
from geopy.geocoders import Nominatim

# ----------------------------
# Setup
# ----------------------------
app = FastAPI()
load_dotenv()

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
