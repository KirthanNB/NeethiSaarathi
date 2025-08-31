from fastapi import APIRouter, Depends, Body, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel
from .agent import run_agent
from .database import get_db
from .search import retrieve as _retrieve
from .llm import answer
from .db_retry import retry_db
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class QueryRequest(BaseModel):
    q: str

class AgentRequest(BaseModel):
    question: str

@router.post("/query")
def query(request: QueryRequest, db: Session = Depends(get_db)):
    try:
        q = request.q
        hits = safe_retrieve(q, k=3, db=db)
        context = "\n\n---\n\n".join([h["content"] for h in hits]) if hits else ""
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
        return await run_agent(body.question, db)
    except SQLAlchemyError as e:
        logger.error(f"Database error in agent: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")
    except Exception as e:
        logger.error(f"Error in agent: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")