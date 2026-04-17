from openai import AsyncOpenAI
from app.core.config import settings
import json

client = AsyncOpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=settings.OPENROUTER_API_KEY or "dummy_key",
)

async def enhance_bullet_point(text: str, role: str, tone: str) -> dict:
    """OpenRouter AI enhancement service"""
    if not settings.OPENROUTER_API_KEY or settings.OPENROUTER_API_KEY == "your_open_router_api_key_here":
        # Fallback to error message if no key
        return {
            "original": text,
            "enhanced": f"[API KEY MISSING] Please add your OPENROUTER_API_KEY to the backend/.env file to enhance this bullet point: '{text}'",
            "suggestions": []
        }
        
    prompt = f"""
    You are an expert technical resume writer.
    Consider the following bullet point from a user applying for a {role} role.
    Improve this bullet point to be extremely professional, utilizing action verbs, focusing on impact, and maintaining a {tone} tone.
    Output MUST be in valid JSON format with the following keys:
    - "enhanced" (string): the single improved bullet point.
    - "suggestions" (list of strings): 1-2 actionable suggestions for the user to make it even better (e.g. telling them to add quantified metrics if missing).
    
    Original bullet point: "{text}"
    """
    
    try:
        completion = await client.chat.completions.create(
          model="openai/gpt-oss-120b", # Using user requested model
          messages=[
            {"role": "user", "content": prompt}
          ]
        )
        response_content = completion.choices[0].message.content
        
        # very basic json extraction if the model wrapped it in markdown
        if response_content.startswith("```json"):
            response_content = response_content.replace("```json\\n", "").replace("```json\n", "").replace("```", "")
        
        data = json.loads(response_content)
        return {
            "original": text,
            "enhanced": data.get("enhanced", "Failed to parse enhancement."),
            "suggestions": data.get("suggestions", [])
        }
    except Exception as e:
        return {
            "original": text,
            "enhanced": f"Error running OpenRouter API: {str(e)}",
            "suggestions": []
        }

async def generate_full_resume(data: dict) -> dict:
    """Generate a full tailored resume based on all inputs."""
    if not settings.OPENROUTER_API_KEY or settings.OPENROUTER_API_KEY == "your_open_router_api_key_here":
        return {"error": "API Key Missing"}

    prompt = f"""
    You are an expert technical resume writer and career coach.
    I will provide you with a candidate's details and the target Job Description. 
    Your task is to write a highly tailored, ATS-friendly, professional resume for this candidate based ONLY on their provided details, optimized for the target job.

    Target Job Description:
    {data.get('target_job_description', 'None provided')}

    Candidate Name: {data.get('full_name')}
    Phone: {data.get('phone')}
    Email: {data.get('email')}
    LinkedIn: {data.get('linkedin')}
    GitHub: {data.get('github')}
    Location: {data.get('location')}
    Skills Provided: {', '.join(data.get('skills', []))}
    
    Education History:
    {json.dumps(data.get('education', []), indent=2)}
    
    Experience Details:
    {json.dumps(data.get('experiences', []), indent=2)}
    
    Projects Provided:
    {json.dumps(data.get('projects', []), indent=2)}
    
    Certifications Provided:
    {data.get('certifications', '')}
    
    Achievements Provided:
    {data.get('achievements', '')}
    
    Instructions:
    1. Write a compelling Professional Summary (3-4 sentences) showing how their background perfectly fits the job.
    2. Rewrite and enhance their EXPERIENCE bullet points to be impact-driven (use action verbs, metrics where possible) tailored to the required skills in the job description.
    3. Process the PROJECTS section. Turn the user's project key_concepts into 2-3 impact-driven bullet points.
    4. Parse the provided certifications and achievements into arrays of strings. 
    5. Output valid JSON matching EXACTLY this structure:
    {{
      "full_name": "{data.get('full_name', '')}",
      "phone": "{data.get('phone', '')}",
      "email": "{data.get('email', '')}",
      "linkedin": "{data.get('linkedin', '')}",
      "github": "{data.get('github', '')}",
      "location": "{data.get('location', '')}",
      "photo_url": "{data.get('photo_url', '')}",
      "professional_summary": "...",
      "education": [{{ "institution": "...", "degree": "...", "graduation_year": "...", "details": "..." }}],
      "experiences": [{{ "company": "...", "role": "...", "duration": "...", "description": "..." }}],
      "projects": [{{ "name": "...", "tech_stack": "...", "link": "...", "bullet_points": ["...", "..."] }}],
      "certifications": ["...", "..."],
      "achievements": ["...", "..."],
      "skills": ["...", "..."]
    }}
    
    Do NOT include any markdown blocks or explanations outside the JSON object.
    """

    try:
        completion = await client.chat.completions.create(
          model="openai/gpt-oss-120b",
          messages=[{"role": "user", "content": prompt}]
        )
        response_content = completion.choices[0].message.content.strip()
        
        if response_content.startswith("```json"):
            response_content = response_content.replace("```json\\n", "").replace("```json\n", "").replace("```", "")
            
        result = json.loads(response_content)
        return result
    except Exception as e:
        return {"error": str(e)}
