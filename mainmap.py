from fastapi import FastAPI
from pydantic import BaseModel
import os
from fastapi.middleware.cors import CORSMiddleware
import os
import sys
from dotenv import load_dotenv
from langchain_google_genai import (ChatGoogleGenerativeAI,GoogleGenerativeAI,
                                    GoogleGenerativeAIEmbeddings)
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableLambda



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
os.environ["GROQ_API_KEY"] = GROQ_API_KEY


def get_gemini():

        llm = GoogleGenerativeAI(model="gemini-2.0-flash", google_api_key=GOOGLE_API_KEY)
        # llm = ChatGroq(model="llama-3.3-70b-versatile")
        # llm = ChatGroq(model="llama3-8b-8192")
        # llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=GOOGLE_API_KEY)
    
        return llm

import re
import json

def clean_json_output(output_str):
        """
        Remove markdown code block formatting and return raw JSON object.
        """
        # Remove ```json and ``` from start/end if present
        cleaned = re.sub(r"^```json\s*|\s*```$", "", output_str.strip(), flags=re.DOTALL)
        
        return cleaned


class RoadmapRequest(BaseModel):
    goal: str

@app.post("/generate-roadmap")
async def generate_roadmap(req: RoadmapRequest):
    llm = get_gemini()
    target = req.goal
    prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "Create a structured learning roadmap for: {target}. Split into stages with duration and key topics. Return as pure JSON no markedown",
        ),
       
    ]
    )

    llm_o = prompt | llm
    # Wrap the cleaner in a RunnableLambda
    cleaner = RunnableLambda(lambda x: clean_json_output(x))

    chain = llm_o | cleaner 

    response = chain.invoke({"target":target})

    print(response)

    print(json.loads(response))

    return json.loads(response)


# uvicorn mainmap:app --host 0.0.0.0 --port 8000 --reload