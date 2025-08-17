from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, Text

Base = declarative_base()

class Chunk(Base):
    __tablename__ = "chunks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    source = Column(String(255), nullable=False)
    title = Column(String(255))
    content = Column(Text, nullable=False)

    # NOTE: Your table may still have `embedding` (vector) in DB.
    # We intentionally do NOT map it here since we don't need it for queries.

    def __repr__(self):
        return f"<Chunk(id={self.id}, title={self.title!r})>"
