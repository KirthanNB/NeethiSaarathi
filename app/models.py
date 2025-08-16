# app/models.py
from sqlalchemy import Column, Integer, String, Text, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
try:
    from tidb_vector.sqlalchemy import VectorType
except ImportError:
    from sqlalchemy import LargeBinary as VectorType  # Fallback

Base = declarative_base()

class Chunk(Base):
    __tablename__ = 'chunks'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    source = Column(String(255), nullable=False)
    title = Column(String(255))
    content = Column(Text, nullable=False)
    embedding = Column(VectorType(dim=384))  # Using 384 dimensions for all-MiniLM-L6-v2
    created_at = Column(TIMESTAMP, server_default='CURRENT_TIMESTAMP')

    def __repr__(self):
        return f"<Chunk(id={self.id}, title='{self.title}')>"