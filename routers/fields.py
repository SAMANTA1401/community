# routers/fields.py
from fastapi import APIRouter
import json

router = APIRouter()

@router.get("/fields")
def get_fields():
    with open("data/fields_data.json") as f:
        fields = json.load(f)
    return {"fields": fields}
