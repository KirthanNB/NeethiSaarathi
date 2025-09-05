# questionnaire.py - MODIFY TO REMOVE DUPLICATE ROUTES
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

# REMOVE ALL THE DUPLICATE ROUTE DEFINITIONS FROM HERE
# KEEP ONLY UNIQUE FUNCTIONALITY OR DELETE THIS FILE ENTIRELY

# If you want to keep this file for organization, remove the duplicate routes:
@router.get("/questionnaire/categories")
async def get_questionnaire_categories():
    """Get available questionnaire categories - UNIQUE FUNCTIONALITY"""
    return {
        "categories": [
            "personal_info",
            "education",
            "employment",
            "agriculture",
            "business",
            "health"
        ]
    }