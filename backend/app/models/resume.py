from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.models.base import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    target_job_description = Column(Text, nullable=True)
    
    # Store the JSON generated output
    generated_content = Column(JSON, nullable=True)
    
    # A back_populates relationship could be added if User model has 'resumes'
