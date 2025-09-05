from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, Text
from sqlalchemy import Column, Integer, String, Text, JSON, DateTime, Boolean
from datetime import datetime

Base = declarative_base()

class Chunk(Base):
    __tablename__ = "unified_chunks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    source = Column(String(255), nullable=False)
    title = Column(String(255))
    content = Column(Text, nullable=False)

    # NOTE: Your table may still have `embedding` (vector) in DB.
    # We intentionally do NOT map it here since we don't need it for queries.

    def __repr__(self):
        return f"<Chunk(id={self.id}, title={self.title!r})>"
class UserProfile(Base):
    __tablename__ = "user_profiles"
    
    id = Column(Integer, primary_key=True)
    session_id = Column(String(255), unique=True, index=True)
    
    # Phase 1: Universal questions
    state = Column(String(100))
    gender = Column(String(50))
    social_category = Column(String(100))
    annual_income = Column(String(100))
    has_disability = Column(Boolean)
    occupation = Column(String(100))
    
    # Phase 2: Occupation-specific (all nullable)
    education_level = Column(String(100), nullable=True)
    field_of_study = Column(String(100), nullable=True)
    grades = Column(String(50), nullable=True)
    land_ownership = Column(Boolean, nullable=True)
    land_size = Column(String(50), nullable=True)
    crop_type = Column(String(100), nullable=True)
    business_type = Column(String(100), nullable=True)
    business_needs = Column(String(100), nullable=True)
    highest_education = Column(String(100), nullable=True)
    employment_seeking = Column(Boolean, nullable=True)
    pension_status = Column(Boolean, nullable=True)
    health_needs = Column(Boolean, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            "session_id": self.session_id,
            "state": self.state,
            "gender": self.gender,
            "social_category": self.social_category,
            "annual_income": self.annual_income,
            "has_disability": self.has_disability,
            "occupation": self.occupation,
            "education_level": self.education_level,
            "field_of_study": self.field_of_study,
            "grades": self.grades,
            "land_ownership": self.land_ownership,
            "land_size": self.land_size,
            "crop_type": self.crop_type,
            "business_type": self.business_type,
            "business_needs": self.business_needs,
            "highest_education": self.highest_education,
            "employment_seeking": self.employment_seeking,
            "pension_status": self.pension_status,
            "health_needs": self.health_needs,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }