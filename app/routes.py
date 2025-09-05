from fastapi import APIRouter, Depends, Body, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel
from typing import Optional
from fastapi.responses import JSONResponse  # ADD THIS IMPORT
from .agent import run_agent
from .database import get_db
from .search import retrieve as _retrieve
from .llm import answer
from .db_retry import retry_db
from .models import UserProfile
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# ✅ ADD GLOBAL OPTIONS HANDLER FOR ALL ROUTES IN THIS ROUTER
@router.options("/{path:path}")
async def options_handler(path: str):
    return JSONResponse(status_code=200, content={"message": "OK"})

class QueryRequest(BaseModel):
    q: str
    session_id: Optional[str] = None

class AgentRequest(BaseModel):
    question: str
    session_id: Optional[str] = None

class ProfileRequest(BaseModel):
    session_id: str
    state: Optional[str] = None
    gender: Optional[str] = None
    social_category: Optional[str] = None
    annual_income: Optional[str] = None
    has_disability: Optional[bool] = None
    occupation: Optional[str] = None
    education_level: Optional[str] = None
    field_of_study: Optional[str] = None
    grades: Optional[str] = None
    land_ownership: Optional[bool] = None
    land_size: Optional[str] = None
    crop_type: Optional[str] = None
    business_type: Optional[str] = None
    business_needs: Optional[str] = None
    highest_education: Optional[str] = None
    employment_seeking: Optional[bool] = None
    pension_status: Optional[bool] = None
    health_needs: Optional[bool] = None

@router.post("/query")
def query(request: QueryRequest, db: Session = Depends(get_db)):
    try:
        q = request.q
        hits = safe_retrieve(q, k=3, db=db)
        context = "\n\n---\n\n".join([h["content"] for h in hits]) if hits else ""
        
        # ADD PERSONALIZATION CONTEXT
        if request.session_id:
            profile = db.query(UserProfile).filter(UserProfile.session_id == request.session_id).first()
            if profile:
                profile_context = f"""
                USER PROFILE FOR PERSONALIZATION:
                - State: {profile.state}
                - Gender: {profile.gender}
                - Social Category: {profile.social_category}
                - Annual Income: {profile.annual_income}
                - Has Disability: {profile.has_disability}
                - Occupation: {profile.occupation}
                - Education Level: {profile.education_level}
                - Field of Study: {profile.field_of_study}
                - Grades: {profile.grades}
                - Land Ownership: {profile.land_ownership}
                - Land Size: {profile.land_size}
                - Crop Type: {profile.crop_type}
                - Business Type: {profile.business_type}
                - Business Needs: {profile.business_needs}
                - Highest Education: {profile.highest_education}
                - Employment Seeking: {profile.employment_seeking}
                - Pension Status: {profile.pension_status}
                - Health Needs: {profile.health_needs}
                """
                context = profile_context + "\n\n" + context

        reply = answer(q, context)

        return {
            "answer": reply,
            "sources": [h["source"] for h in hits],
            "matches": [{"id": h["id"], "title": h["title"]} for h in hits],
        }
    except SQLAlchemyError as e:
        logger.error(f"Database error in query: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")
    except Exception as e:
        logger.error(f"Error in query: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@retry_db
def safe_retrieve(*args, **kwargs):
    return _retrieve(*args, **kwargs)

@router.post("/agent")
async def agent_endpoint(body: AgentRequest, db: Session = Depends(get_db)):
    try:
        # ADD PERSONALIZATION TO AGENT TOO
        user_context = ""
        if body.session_id:
            profile = db.query(UserProfile).filter(UserProfile.session_id == body.session_id).first()
            if profile:
                user_context = f"""
                USER PROFILE:
                - State: {profile.state}
                - Gender: {profile.gender}
                - Social Category: {profile.social_category}
                - Annual Income: {profile.annual_income}
                - Has Disability: {profile.has_disability}
                - Occupation: {profile.occupation}
                - Education Level: {profile.education_level}
                - Field of Study: {profile.field_of_study}
                - Grades: {profile.grades}
                """
        
        # Pass user context to the agent
        result = await run_agent(body.question, db, user_context)
        return result
        
    except SQLAlchemyError as e:
        logger.error(f"Database error in agent: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")
    except Exception as e:
        logger.error(f"Error in agent: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# ADD THESE PROFILE MANAGEMENT ENDPOINTS
@router.post("/user/profile")
async def save_user_profile(
    request: ProfileRequest,
    db: Session = Depends(get_db)
):
    try:
        # Find or create profile
        profile = db.query(UserProfile).filter(UserProfile.session_id == request.session_id).first()
        
        if profile:
            # Update existing profile
            update_data = request.dict(exclude_unset=True)
            for key, value in update_data.items():
                if hasattr(profile, key) and key != 'session_id':
                    setattr(profile, key, value)
        else:
            # Create new profile
            profile_data = request.dict()
            profile = UserProfile(**profile_data)
            db.add(profile)
        
        db.commit()
        db.refresh(profile)
        
        return {
            "success": True,
            "message": "Profile saved successfully",
            "profile": {
                "session_id": profile.session_id,
                "state": profile.state,
                "gender": profile.gender,
                "social_category": profile.social_category,
                "annual_income": profile.annual_income,
                "has_disability": profile.has_disability,
                "occupation": profile.occupation,
                "education_level": profile.education_level,
                "field_of_study": profile.field_of_study,
                "grades": profile.grades,
                "land_ownership": profile.land_ownership,
                "land_size": profile.land_size,
                "crop_type": profile.crop_type,
                "business_type": profile.business_type,
                "business_needs": profile.business_needs,
                "highest_education": profile.highest_education,
                "employment_seeking": profile.employment_seeking,
                "pension_status": profile.pension_status,
                "health_needs": profile.health_needs
            }
        }
        
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error saving profile: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")
    except Exception as e:
        db.rollback()
        logger.error(f"Error saving profile: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/user/profile")
async def get_user_profile(
    session_id: str = Query(..., description="User session ID"),
    db: Session = Depends(get_db)
):
    try:
        profile = db.query(UserProfile).filter(UserProfile.session_id == session_id).first()
        
        if not profile:
            return {
                "success": False,
                "message": "Profile not found",
                "profile": None
            }
        
        return {
            "success": True,
            "profile": {
                "session_id": profile.session_id,
                "state": profile.state,
                "gender": profile.gender,
                "social_category": profile.social_category,
                "annual_income": profile.annual_income,
                "has_disability": profile.has_disability,
                "occupation": profile.occupation,
                "education_level": profile.education_level,
                "field_of_study": profile.field_of_study,
                "grades": profile.grades,
                "land_ownership": profile.land_ownership,
                "land_size": profile.land_size,
                "crop_type": profile.crop_type,
                "business_type": profile.business_type,
                "business_needs": profile.business_needs,
                "highest_education": profile.highest_education,
                "employment_seeking": profile.employment_seeking,
                "pension_status": profile.pension_status,
                "health_needs": profile.health_needs,
                "created_at": profile.created_at.isoformat() if profile.created_at else None,
                "updated_at": profile.updated_at.isoformat() if profile.updated_at else None
            }
        }
        
    except SQLAlchemyError as e:
        logger.error(f"Database error fetching profile: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")

@router.get("/user/profile/exists")
async def check_profile_exists(
    session_id: str = Query(..., description="User session ID"),
    db: Session = Depends(get_db)
):
    try:
        profile = db.query(UserProfile).filter(UserProfile.session_id == session_id).first()
        return {
            "success": True,
            "exists": profile is not None,
            "is_complete": profile is not None  # Make this less strict
        }
        
    except SQLAlchemyError as e:
        logger.error(f"Database error checking profile: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")

@router.delete("/user/profile")
async def delete_user_profile(
    session_id: str = Query(..., description="User session ID to delete"),
    db: Session = Depends(get_db)
):
    try:
        profile = db.query(UserProfile).filter(UserProfile.session_id == session_id).first()
        
        if not profile:
            return {
                "success": False,
                "message": "Profile not found"
            }
        
        db.delete(profile)
        db.commit()
        
        return {
            "success": True,
            "message": "Profile deleted successfully"
        }
        
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error deleting profile: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")