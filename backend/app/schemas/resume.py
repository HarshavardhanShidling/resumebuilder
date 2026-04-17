from pydantic import BaseModel, Field
from typing import List, Optional

# --- Single Bullet Enhancement Schemas ---
class BulletPointRequest(BaseModel):
    text: str
    target_role: Optional[str] = "Software Engineer"
    tone: Optional[str] = "Professional"

class BulletPointResponse(BaseModel):
    original: str
    enhanced: str
    suggestions: List[str]

# --- Full Resume Generation Schemas ---
class EducationInput(BaseModel):
    institution: str
    degree: str
    graduation_year: str
    details: Optional[str] = None

class ExperienceInput(BaseModel):
    company: str
    role: str
    duration: str
    description: str

class ProjectInput(BaseModel):
    name: str
    tech_stack: str
    key_concepts: str
    link: Optional[str] = None

class ProjectResponse(BaseModel):
    name: str
    tech_stack: str
    link: Optional[str] = None
    bullet_points: List[str]

class FullResumeRequest(BaseModel):
    full_name: str
    phone: str
    email: str
    linkedin: Optional[str] = None
    github: Optional[str] = None
    location: str
    photo_url: Optional[str] = None
    education: List[EducationInput]
    experiences: List[ExperienceInput]
    projects: List[ProjectInput] = []
    certifications: str = ""
    achievements: str = ""
    skills: List[str]
    target_job_description: str

class ResumeSection(BaseModel):
    heading: str
    content: str | List[str]

class GeneratedResumeResponse(BaseModel):
    full_name: str
    phone: str
    email: str
    linkedin: Optional[str] = None
    github: Optional[str] = None
    location: str
    photo_url: Optional[str] = None
    professional_summary: str
    education: List[EducationInput]
    experiences: List[ExperienceInput] # these will have AI-enhanced bullet points
    projects: List[ProjectResponse] = []
    certifications: List[str] = []
    achievements: List[str] = []
    skills: List[str]
