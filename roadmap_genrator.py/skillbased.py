from langchain.prompts import PromptTemplate
import sys
import re
import json
import os
from dotenv import load_dotenv
from langchain_google_genai import (ChatGoogleGenerativeAI,GoogleGenerativeAI,
                                    GoogleGenerativeAIEmbeddings)
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableLambda



prompt = """
Create a comprehensive JSON roadmap for mastering a specified skill or profession, tailored to a student's current education stage and career goal. The roadmap should guide the student from beginner to advanced, job-ready proficiency. Include essential metadata for each category and topic to provide context and clarity. Follow these guidelines:

1. **Input Requirements**:

   - **Current Education Stage**: The student's current level of {education} (e.g., high school, undergraduate, graduate, self-taught).
   - **Desired Skill/Profession**: The specific {skill} or profession the student aims to master (e.g., Data Science, Software Engineering, Graphic Design).

2. **Output Structure**:

   - Generate a JSON object with the following structure:
     - **Root Level**:
       - `id`: A unique identifier for the roadmap (e.g., lowercase, underscore-separated skill/profession name).
       - `name`: The name of the skill or profession.
       - `type`: Set to "root".
       - `meta`: An object containing a `description` field summarizing the roadmap's purpose.
       - `children`: An array of category objects.
     - **Category Level**:
       - `id`: A unique identifier for the category (e.g., lowercase, underscore-separated category name).
       - `name`: The name of the category (e.g., "Introduction to [Skill]", "Core Concepts").
       - `type`: Set to "category".
       - `meta`: An object containing an `overview` field describing the category's focus.
       - `children`: An array of topic objects.
     - **Topic Level**:
       - `id`: A unique identifier for the topic (e.g., lowercase, underscore-separated topic name).
       - `name`: The name of the topic (e.g., "Linear Algebra", "Supervised Learning").
       - `type`: Set to "topic".
       - `meta` (optional): An object containing additional details (e.g., `details` field for specific subtopics or focus areas).
     - **SubTopic Level**:
       - `id`: A unique identifier for the topic (e.g., lowercase, underscore-separated topic name).
       - `name`: The name of the topic (e.g., "Linear Algebra", "Supervised Learning").
       - `type`: Set to "topic".
       - `meta` (optional): An object containing additional details (e.g., `details` field for specific subtopics or focus areas).



       

   - Ensure the roadmap is hierarchical, with categories grouping related topics logically.
   - Include at least 5-10 categories, each with 4-6 relevant topics, covering the progression from beginner to advanced levels.
   - Tailor the content to the student's education stage, ensuring foundational topics for beginners and advanced topics for job-readiness.

3. **Content Guidelines**:

   - **Beginner Level**: Include introductory topics that build foundational knowledge, considering the student's current education stage.
   - **Intermediate Level**: Include core concepts, tools, and techniques essential for practical application.
   - **Advanced Level**: Include specialized topics, advanced methodologies, and industry-relevant skills for job-readiness.
   - **Metadata**: Provide concise, informative metadata (`description` for root, `overview` for categories, and optional `details` for topics) to clarify the purpose and scope of each section.
   - **Logical Progression**: Structure the roadmap to reflect a clear learning path, starting with fundamentals and progressing to advanced, job-ready skills.
   - **Relevance**: Ensure all categories and topics are directly relevant to the specified skill or profession.

4. **Example Input**:

   - Current Education Stage: Undergraduate
   - Desired Skill/Profession: AI Engineering

5. **Output Example**:

{{
  "id": "ai_engineering",
  "name": "AI Engineering",
  "type": "root",
  "meta": {{
    "description": "Comprehensive roadmap for mastering AI Engineering"
  }},
  "children": [
    {{
      "id": "intro_ai",
      "name": "Introduction to AI",
      "type": "category",
      "meta": {{
        "overview": "Understand the foundations of Artificial Intelligence"
      }},
      "children": [
        {{
          "id": "history",
          "name": "Definition and History of AI",
          "type": "topic",
          "meta": {{
            "description": "..."
          }},
          "children": [
            {{
            "id": "...",
            "name": "...",
            "type": "...",
            "meta": {{
                "description": "..."
            }}
        }},
        {{
          "id": "importance",
          "name": "Importance of AI",
          "type": "topic"
        }}
      ]
    }}
  ]
}}

   
6. **Prompt Instructions**:

   - Based on the student's current education stage ("\[Education Stage\]") and desired skill/profession ("\[Skill/Profession\]"), generate a JSON roadmap following the structure and guidelines above.
   - Ensure the roadmap is comprehensive, covering all necessary areas to achieve job-readiness in the specified skill or profession.
   - Use clear, concise, and professional language for names and metadata.
   - Validate that the JSON is well-formed and adheres to the hierarchical structure.

Now, generate the JSON roadmap for the specified skill or profession or job role.
"""
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

def clean_json_output(output_str):
        """
        Remove markdown code block formatting and return raw JSON object.
        """
        # Remove ```json and ``` from start/end if present
        cleaned = re.sub(r"^```json\s*|\s*```$", "", output_str.strip(), flags=re.DOTALL)
        return cleaned

prompt = PromptTemplate(
            template=prompt,
            input_variables=["education", "skill"],
            partial_variables={}
    
        )

llm_o = prompt | get_gemini()

# Wrap the cleaner in a RunnableLambda
cleaner = RunnableLambda(lambda x: clean_json_output(x))

chain = llm_o | cleaner 

response = chain.invoke(
    {
        "education": "graduation", "skill": "data scientist"
    }
 
)

print(response)