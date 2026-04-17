from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.resume import Resume
from app.schemas.resume import (
    BulletPointRequest, 
    BulletPointResponse, 
    FullResumeRequest, 
    GeneratedResumeResponse
)
from app.services.ai_service import enhance_bullet_point, generate_full_resume

router = APIRouter()

@router.post("/enhance", response_model=BulletPointResponse)
async def enhance_resume_bullet(request: BulletPointRequest):
    """Enhance a given resume bullet point using AI."""
    result = await enhance_bullet_point(request.text, request.target_role, request.tone)
    return BulletPointResponse(**result)

@router.post("/generate", response_model=GeneratedResumeResponse)
async def generate_tailored_resume(request: FullResumeRequest, db: Session = Depends(get_db)):
    """Generate a fully tailored resume based on candidate data and target job description."""
    # Convert Pydantic model to dictionary
    data = request.model_dump()
    
    result = await generate_full_resume(data)
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
        
    # Save the generated resume into the database
    new_resume = Resume(
        target_job_description=request.target_job_description,
        generated_content=result
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)
        
    return GeneratedResumeResponse(**result)

@router.post("/export")
def export_resume():
    """Placeholder for saving/exporting the resume to PDF."""
    return {"message": "Export functionality coming soon"}
