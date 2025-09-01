# CREATE THIS NEW FILE IN app/questionnaire.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel
from typing import Dict, List, Union, Optional
from .database import get_db
from .models import UserProfile
import logging
import uuid

logger = logging.getLogger(__name__)

router = APIRouter()

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
            "profile": profile.to_dict()
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
            "profile": profile.to_dict()
        }
        
    except SQLAlchemyError as e:
        logger.error(f"Database error fetching profile: {e}")
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
            "is_complete": profile is not None and profile.occupation is not None
        }
        
    except SQLAlchemyError as e:
        logger.error(f"Database error checking profile: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")