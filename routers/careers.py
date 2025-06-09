# routers/careers.py
from fastapi import APIRouter
import json

router = APIRouter()

@router.get("/careers/{field}")
def get_careers(field: str):
    with open("data/careers_data.json") as f:
        careers_data = json.load(f)
    careers_for_field = careers_data.get(field, [])
    career_titles = [career["title"] for career in careers_for_field]
    return {"careers": career_titles}

