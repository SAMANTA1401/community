from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import random

router = APIRouter()

# Sample NEET subjects & topics
topics = {
    "Physics": ["Kinematics", "Laws of Motion", "Work Energy Power"],
    "Chemistry": ["Mole Concept", "Thermodynamics", "Equilibrium"],
    "Biology": ["Cell", "Genetics", "Human Physiology"]
}

class StudentProfile(BaseModel):
    name: str
    strengths: List[str]
    weaknesses: List[str]
    days_available: int

@router.post("/generate-plan")
def generate_study_plan(profile: StudentProfile):
    plan = []
    all_subjects = list(topics.keys())

    for day in range(profile.days_available):
        daily_plan = {"day": day + 1, "tasks": []}
        
        # Weakness topics get more weight
        for subject in all_subjects:
            topic_list = topics[subject]
            weak_topics = [t for t in topic_list if t in profile.weaknesses]
            strong_topics = [t for t in topic_list if t in profile.strengths]

            chosen = random.choices(
                population=(weak_topics + strong_topics),
                weights=([2] * len(weak_topics) + [1] * len(strong_topics)),
                k=1
            )
            if chosen:
                daily_plan["tasks"].append({"subject": subject, "topic": chosen[0]})
        plan.append(daily_plan)

    return {"plan": plan}
