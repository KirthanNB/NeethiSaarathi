from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.search import retrieve
from app.llm import answer

router = APIRouter()

@router.post("/query")
def query(q: str, db: Session = Depends(get_db)):
    hits = retrieve(q, k=3, db=db)
    context = "\n".join([c.content for c in hits])
    reply = answer(q, context)
    return {"answer": reply, "sources": [h.source for h in hits]}