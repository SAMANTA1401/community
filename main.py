from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from study_plan import router as plan_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow your frontend origin only in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(plan_router)
