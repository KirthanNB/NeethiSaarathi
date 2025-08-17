from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.search import retrieve
from app.llm import answer

router = APIRouter()

class QueryRequest(BaseModel):
    q: str

@router.post("/query")
def query(request: QueryRequest, db: Session = Depends(get_db)):
    q = request.q

    hits = retrieve(q, k=3, db=db)  # list[dict] with id/source/title/content
    context = "\n\n---\n\n".join([h["content"] for h in hits]) if hits else ""

    reply = answer(q, context)

    return {
        "answer": reply,
        "sources": [h["source"] for h in hits],
        "matches": [{"id": h["id"], "title": h["title"]} for h in hits],
    }
