# app/search.py
import os
from pathlib import Path
from typing import List
from dotenv import load_dotenv
from sqlalchemy import create_engine, select, func
from sqlalchemy.orm import Session, sessionmaker
from sentence_transformers import SentenceTransformer
from models import Base, Chunk

# Configuration - using absolute paths
BASE_DIR = Path(__file__).parent.parent
DOTENV_PATH = BASE_DIR / ".env"
CERT_PATH = BASE_DIR / "cacert.pem"
MODEL_NAME = "all-MiniLM-L6-v2"
DEFAULT_RESULTS = 5

def initialize_components():
    """Initialize with proper path handling"""
    # Verify .env exists
    if not DOTENV_PATH.exists():
        raise FileNotFoundError(f"Missing .env file at {DOTENV_PATH}")

    # Verify certificate exists if using SSL
    if not CERT_PATH.exists():
        raise FileNotFoundError(f"Missing SSL cert at {CERT_PATH}")

    load_dotenv(DOTENV_PATH)
    
    # Setup database engine
    engine = create_engine(
        os.getenv("TIDB_URL"),
        connect_args={
            "ssl": {
                "ca": str(CERT_PATH),
                "check_hostname": True
            }
        },
        pool_pre_ping=True
    )
    
    # Initialize model
    model = SentenceTransformer(MODEL_NAME)
    
    return engine, model

def retrieve(db: Session, query: str, k: int = DEFAULT_RESULTS) -> List[Chunk]:
    """Search implementation with error handling"""
    try:
        print(f"\n🔍 Searching for: '{query}'")
        
        # Verify database content
        count = db.scalar(select(func.count()).select_from(Chunk))
        print(f"📊 Found {count} chunks")
        if count == 0:
            raise ValueError("Database empty - run ingest.py first")

        # Generate embedding
        query_embedding = Chunk.model.encode(query).tolist()
        
        # Execute search
        results = db.query(Chunk)\
                   .order_by(Chunk.embedding.cosine_distance(query_embedding))\
                   .limit(k)\
                   .all()
        
        print(f"✅ Found {len(results)} results")
        return results
        
    except Exception as e:
        print(f"❌ Search failed: {str(e)}")
        db.rollback()
        raise

def main():
    """Complete executable workflow"""
    try:
        print("🚀 Initializing search system...")
        engine, _ = initialize_components()
        SessionLocal = sessionmaker(bind=engine)
        db = SessionLocal()

        while True:
            try:
                query = input("\nEnter search query (or 'quit' to exit): ").strip()
                if query.lower() in ('quit', 'exit'):
                    break
                if not query:
                    print("⚠️ Please enter a query")
                    continue

                results = retrieve(db, query=query, k=3)
                
                print("\n🔎 Results:")
                for i, chunk in enumerate(results, 1):
                    print(f"\n{i}. {chunk.title}")
                    print(f"   {chunk.content[:150]}...")
                    print(f"   Source: {getattr(chunk, 'source', 'N/A')}")

            except Exception as e:
                print(f"⚠️ Error: {str(e)}")
                continue

    except Exception as e:
        print(f"💥 Critical error: {str(e)}")
    finally:
        db.close()
        print("\n👋 Search session ended")

if __name__ == "__main__":
    main()