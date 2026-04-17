from fastapi import APIRouter
from app.api.v1.endpoints import resume

api_router = APIRouter()

@api_router.get("/status", tags=["System"])
def status():
    return {"status": "running"}

api_router.include_router(resume.router, prefix="/resume", tags=["Resume API"])
