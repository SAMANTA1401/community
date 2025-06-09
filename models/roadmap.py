# models/roadmap.py
from pydantic import BaseModel
from typing import List, Optional

class RoadmapTopic(BaseModel):
    topic: str
    subtopics: List[str]

class RoadmapStage(BaseModel):
    stage: int
    title: str
    topics: List[RoadmapTopic]

class RoadmapRequest(BaseModel):
    education: str
    target: Optional[str] = None
    roadmap_type: str  # "degree", "skill", "exploratory"

class RoadmapResponse(BaseModel):
    title: str
    stages: List[RoadmapStage]
