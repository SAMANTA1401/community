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
Create a comprehensive JSON roadmap for achieving a specified career goal through a degree-based educational path, tailored to a student's current education stage and desired profession. The roadmap should guide the student from their current level to job-readiness, including relevant degrees, exams, and opportunities at each stage. Include essential metadata for each level and component to provide context and clarity. Follow these guidelines:

1. **Input Requirements**:

   - **Current Education Stage**: The student's current level of education (e.g., high school, undergraduate, graduate, self-taught): {education}
   - **Desired Profession**: The specific profession the student aims to pursue (e.g., Software Engineer, Data Scientist, Medical Doctor): {profession}

2. **Output Structure**:

   - Generate a JSON object with the following structure:
     - **Root Level**:
       - `id`: A unique identifier for the roadmap (e.g., lowercase, underscore-separated profession name).
       - `name`: The name of the profession (e.g., "Software Engineering", "Data Science").
       - `type`: Set to "root".
       - `meta`: An object containing a `description` field summarizing the roadmap's purpose and scope.
       - `children`: An array of degree-level objects.
     - **Degree Level**:
       - `id`: A unique identifier for the degree stage (e.g., "high_school", "bachelors_degree", "masters_degree").
       - `name`: The name of the degree or educational stage (e.g., "High School Preparation", "Bachelor’s Degree").
       - `type`: Set to "degree".
       - `meta`: An object containing:
         - `overview`: A brief description of the degree stage's role in the career path.
         - `duration`: Estimated time to complete the stage (e.g., "2 years", "4 years").
         - `prerequisites` (optional): Entry requirements (e.g., exams, prior education).
       - `children`: An array of component objects (e.g., coursework, exams, opportunities).
     - **Component Level**:
       - `id`: A unique identifier for the component (e.g., "core_courses", "entrance_exams", "internships").
       - `name`: The name of the component (e.g., "Core Coursework", "Entrance Exams", "Internship Opportunities").
       - `type`: Set to "component".
       - `meta`: An object containing:
         - `details`: Specific information about the component (e.g., list of courses, exam names, types of opportunities).
         - `importance` (optional): Why this component is critical for the career path.

   - Ensure the roadmap is hierarchical, with degree levels grouping relevant components (coursework, exams, opportunities).
   - Include at least 3-5 degree stages (e.g., high school, bachelor’s, master’s, certifications) as applicable, each with 3-6 components.
   - Tailor the content to the student’s current education stage, ensuring a clear progression to job-readiness.

3. **Content Guidelines**:

   - **Educational Progression**:
     - Start from the student’s current education stage and outline necessary degrees or certifications.
     - Include preparatory stages (e.g., high school coursework for college admissions) if applicable.
     - Cover advanced degrees or certifications required for the profession.
   - **Exams**:
     - Specify relevant entrance exams (e.g., SAT, GRE, MCAT) or certification exams (e.g., PMP, AWS Certification).
     - Include preparation steps or resources in the `meta.details` field.
   - **Opportunities**:
     - Highlight internships, research opportunities, networking events, or industry projects relevant to each stage.
     - Specify how these opportunities contribute to job-readiness.
   - **Metadata**:
     - Provide concise, informative metadata (`description` for root, `overview` and `duration` for degrees, `details` and `importance` for components).
     - Ensure metadata clarifies the purpose and relevance of each stage and component.
   - **Logical Progression**:
     - Structure the roadmap to reflect a clear path from the current stage to job-readiness.
     - Ensure components are relevant to the degree stage and profession.
   - **Relevance**:
     - Tailor coursework, exams, and opportunities to the specific profession and industry standards.

4. **Example Input**:

   - Current Education Stage: High School
   - Desired Profession: Software Engineer

5. **Output Example**:


{{
  "id": "software_engineering",
  "name": "Software Engineering",
  "type": "root",
  "meta": {{
    "description": "Comprehensive degree-based roadmap for becoming a Software Engineer"
  }},
  "children": [
    {{
      "id": "high_school",
      "name": "High School Preparation",
      "type": "degree",
      "meta": {{
        "overview": "Build foundational skills and prepare for college admissions",
        "duration": "2-4 years",
        "prerequisites": "None"
      }},
      "children": [
        {{
          "id": "core_courses",
          "name": "Core Coursework",
          "type": "component",
          "meta": {{
            "details": "Mathematics (Algebra, Calculus), Computer Science, Physics",
            "importance": "Establishes foundational knowledge for engineering programs"
          }}
        }},
        {{
          "id": "entrance_exams",
          "name": "Entrance Exams",
          "type": "component",
          "meta": {{
            "details": "SAT or ACT, AP Computer Science",
            "importance": "Required for admission to competitive undergraduate programs"
          }}
        }}
      ]
    }},
    {{
      "id": "bachelors_degree",
      "name": "Bachelor’s Degree in Computer Science",
      "type": "degree",
      "meta": {{
        "overview": "Core education for software engineering skills",
        "duration": "4 years",
        "prerequisites": "High school diploma, SAT/ACT scores"
      }},
      "children": [
        {{
          "id": "core_courses",
          "name": "Core Coursework",
          "type": "component",
          "meta": {{
            "details": "Data Structures, Algorithms, Software Engineering, Databases",
            "importance": "Provides essential technical skills for software development"
          }}
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
            input_variables=["education", "profession"],
            partial_variables={}
    
        )

llm_o = prompt | get_gemini()

# Wrap the cleaner in a RunnableLambda
cleaner = RunnableLambda(lambda x: clean_json_output(x))

chain = llm_o | cleaner 

response = chain.invoke(
    {
        "education": "graduation", "profession": "data scientist"
    }
 
)

print(response)