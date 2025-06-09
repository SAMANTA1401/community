# main.py or router.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json
from typing import List

# routers/fields.py
from fastapi import APIRouter
import json

router = APIRouter()



# Load roadmap data from JSON
with open("data/roadmap.json") as f:
    ROADMAPS = json.load(f)

# Pydantic models
class RoadmapRequest(BaseModel):
    career: str
    current_state: Optional[str] = None
    target: Optional[str] = None
    mode: str



class Topic(BaseModel):
    topic: str
    subtopics: List[str]

class Stage(BaseModel):
    stage: int
    title: str
    topics: List[Topic]

class RoadmapResponse(BaseModel):
    title: str
    stages: List[Stage]

import asyncio

@router.post("/generate-roadmap", response_model=RoadmapResponse)
async def generate_roadmap(request: RoadmapRequest):
    print("Received request:", request)
    try:

        print(f"Received request: {request}")

        mode = request.mode
        career = request.career

        if mode not in ROADMAPS:
            raise HTTPException(status_code=400, detail="Invalid mode")

        if career not in ROADMAPS[mode]:
            raise HTTPException(status_code=404, detail="Career not found")

        roadmap_data = ROADMAPS[mode][career]
        return RoadmapResponse(**roadmap_data)

    except asyncio.CancelledError:
        print("Request was cancelled by client")
        raise


