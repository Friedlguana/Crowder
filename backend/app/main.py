import json
import os
import random
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from groq import Groq
from geopy.geocoders import Nominatim

# ----------------------------
# Setup
# ----------------------------
app = FastAPI()
load_dotenv()

# Load API key
groq_api_key = os.getenv("GROQ_API_KEY")

if not groq_api_key:
    raise ValueError("GROQ_API_KEY not found in environment variables")

# Client
groq_client = Groq(api_key=groq_api_key)

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

# ----------------------------
# Groq Models (cycle list)
# ----------------------------
groq_models = [
    "llama-3.1-70b-versatile",
    "mixtral-8x7b-32768"
]
current_model_index = 0

@app.get("/")
async def connectionCheck():
    return "Connection Successful"

# ----------------------------
# Utility function: LLM handler
# ----------------------------
def generate_llm_response(prompt: str):
    global current_model_index

    attempts = 0
    while attempts < len(groq_models):
        model = groq_models[current_model_index]
        try:
            response = groq_client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content, model
        except Exception as e:
            if "429" in str(e) or "rate limit" in str(e).lower():
                # Switch to next model
                current_model_index = (current_model_index + 1) % len(groq_models)
                attempts += 1
                continue
            else:
                raise HTTPException(status_code=500, detail=f"Groq error ({model}): {e}")

    raise HTTPException(status_code=500, detail="All Groq models failed due to rate limits")

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
    prompt = f"""You are (name), who is a (jobTitle) living in (city), (country). 
You are (age) years old and a (gender). Review the following idea honestly.
Factor in the demographic that is provided to you while giving your opinion.
If the idea is bad or not good enough, it must be stated along with the reason.
If the idea is good or resonates with you, you should also state accordingly why.
The review shouldn't be more than 3 sentences.
Do not provide anything else but the output format that is requested.
Randomly generate the demographic details.
Do not only choose main cities, but that does not mean you do not choose only un-main cities either.

{{
  "review": "string",
  "name": "string",
  "jobTitle": "string",
  "jobIndustry": "string",
  "city": "string",
  "country": "string",
  "age": int,
  "gender": "string",
  "sentimentScore": "float"
}}

Idea: {submission.idea_text}
"""

    # Call LLM with model cycling
    llm_output, model_used = generate_llm_response(prompt)

    # Parse LLM output
    try:
        response_data = json.loads(llm_output)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail=f"Failed to parse {model_used} response")

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

    return {"status": "success", "idea_id": idea_id, "provider": model_used, "message": response_data}
