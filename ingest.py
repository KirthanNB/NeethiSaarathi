# ingest.py
import os
import numpy as np
import PyPDF2
from sentence_transformers import SentenceTransformer
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from app.models import Base, Chunk

# Configuration
load_dotenv()
PDF_PATH = "data/sample/constitution.pdf"
BATCH_SIZE = 50
MODEL_NAME = "all-MiniLM-L6-v2"

def initialize_components():
    """Initialize database and ML model"""
    # Setup database engine with SSL
    engine = create_engine(
        os.getenv("TIDB_URL","mysql+pymysql://2UKryQY2xjKAPbg.root:6SqoslthiJYnEbIx@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/test"),
        connect_args={
            "ssl": {
                "ca": os.path.join(os.path.dirname(__file__), "cacert.pem"),
                "check_hostname": True
            }
        },
        pool_pre_ping=True
    )
    
    # Verify tables exist
    Base.metadata.create_all(engine)
    
    # Initialize model
    model = SentenceTransformer(MODEL_NAME)
    
    return engine, model

def extract_sections(pdf_path):
    """Improved PDF text extraction with section detection"""
    sections = []
    current_section = ""
    
    with open(pdf_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        
        for page in reader.pages:
            text = page.extract_text()
            if not text:
                continue
                
            # Section detection
            if any(marker in text.upper() for marker in ["SECTION", "ARTICLE", "CHAPTER"]):
                if current_section:
                    sections.append(current_section.strip())
                current_section = text
            else:
                current_section += "\n" + text
                
        if current_section:
            sections.append(current_section.strip())
            
    return [s for s in sections if len(s) > 100]  # Filter short sections

def process_to_database(engine, model, pdf_path):
    """Complete processing pipeline"""
    sections = extract_sections(pdf_path)
    print(f"Found {len(sections)} sections in PDF")
    
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        for i in range(0, len(sections), BATCH_SIZE):
            batch = sections[i:i + BATCH_SIZE]
            
            for j, section in enumerate(batch):
                embedding = model.encode(section)
                chunk = Chunk(
                    source=os.path.basename(pdf_path),
                    title=f"Section {i+j+1}",
                    content=section,
                    embedding=np.array(embedding)  # Must be numpy array
                )
                session.add(chunk)
            
            session.commit()
            print(f"✅ Inserted batch {(i//BATCH_SIZE)+1} ({len(batch)} sections)")
            
        print(f"🎉 Successfully inserted {len(sections)} sections total")
        
    except Exception as e:
        session.rollback()
        print(f"❌ Error: {str(e)}")
        raise
    finally:
        session.close()

if __name__ == "__main__":
    if not os.path.exists(PDF_PATH):
        raise FileNotFoundError(f"PDF not found at {PDF_PATH}")
    
    engine, model = initialize_components()
    process_to_database(engine, model, PDF_PATH)