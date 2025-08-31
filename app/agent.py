from .search import retrieve
from .llm import answer
from .actions import generate_scheme_form
from sqlalchemy.orm import Session
import re
import logging
import json  # Added for JSON parsing

logger = logging.getLogger(__name__)

async def run_agent(question: str, db: Session):
    try:
        logger.info(f"Processing question: {question}")
        
        # 1. Retrieve relevant chunks from ACTUAL database
        chunks = retrieve(question, k=5, db=db)
        logger.info(f"Retrieved {len(chunks)} chunks from database")
        
        if not chunks:
            return {
                "answer": "I couldn't find relevant information in the database for your query.",
                "category": "GENERAL",
                "file": None,
                "sources": []
            }
        
        # 2. Build context from ACTUAL database chunks
        context = build_database_context(chunks)
        logger.info(f"Built context with {len(context)} characters")
        
        # 3. Classify query based on ACTUAL content found in database
        category = classify_query_based_on_content(chunks)
        logger.info(f"Classified query as: {category}")
        
        # 4. Generate answer using ACTUAL database content
        answer_text = answer_scheme_question(question, context)
        logger.info(f"Generated answer with {len(answer_text)} characters")
        
        # 5. Only generate form if it's a scheme AND needs form
        pdf_path = generate_scheme_form(question) if needs_form(question) else None
        if pdf_path:
            logger.info(f"Generated form at: {pdf_path}")

        # 6. Return response with ACTUAL database sources
        return {
            "answer": answer_text,
            "category": category,
            "file": pdf_path,
            "sources": [{
                "id": c["id"], 
                "title": c["title"], 
                "type": c.get("source", "unknown"),
                "field": parse_metadata(c.get('metadata', {})).get('field', 'general'),
                "scheme": parse_metadata(c.get('metadata', {})).get('scheme_name', ''),
                "content_preview": c["content"][:100] + "..." if len(c["content"]) > 100 else c["content"]
            } for c in chunks]
        }
        
    except Exception as e:
        logger.error(f"Error in run_agent: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return {
            "answer": f"Error processing your request: {str(e)}",
            "category": "ERROR",
            "file": None,
            "sources": []
        }

def parse_metadata(metadata):
    """Parse metadata whether it's a string or dict"""
    if isinstance(metadata, str):
        try:
            return json.loads(metadata)
        except json.JSONDecodeError:
            return {}
    elif isinstance(metadata, dict):
        return metadata
    else:
        return {}

def build_database_context(chunks):
    """Build context from ACTUAL database chunks with metadata"""
    context_parts = []
    
    for chunk in chunks:
        # Parse metadata if it's a string (JSON)
        metadata = parse_metadata(chunk.get('metadata', {}))
        
        # Extract scheme name from metadata if available
        scheme_info = ""
        if metadata and 'scheme_name' in metadata:
            scheme_info = f"Scheme: {metadata['scheme_name']}"
        
        # Extract field type (benefits, eligibility, etc.)
        field_info = ""
        if metadata and 'field' in metadata:
            field_info = f" | About: {metadata['field'].capitalize()}"
        
        # Extract source type (pdf/scheme)
        source_info = f"Source: {chunk.get('source', 'unknown')}"
        
        header = f"{source_info} | {scheme_info}{field_info}"
        context_parts.append(f"{header}\n{chunk['content']}")
    
    return "\n\n---\n\n".join(context_parts)

def classify_query_based_on_content(chunks):
    """Classify query based on ACTUAL content found in database"""
    content_text = " ".join([chunk['content'].lower() for chunk in chunks])
    
    # Handle metadata parsing for classification
    metadata_texts = []
    for chunk in chunks:
        metadata = parse_metadata(chunk.get('metadata', {}))
        metadata_texts.append(str(metadata))
    
    metadata_text = " ".join(metadata_texts)
    all_text = content_text + " " + metadata_text
    
    # Check for scheme-related content in ACTUAL data
    scheme_keywords = ['scheme', 'benefit', 'eligibility', 'application', 'document', 
                      'subsidy', 'scholarship', 'financial', 'assistance', 'funding']
    
    # Check for legal/constitution content in ACTUAL data  
    legal_keywords = ['article', 'section', 'act', 'law', 'right', 'constitution', 
                     'legal', 'provision', 'amendment', 'legislative']
    
    scheme_count = sum(1 for keyword in scheme_keywords if keyword in all_text)
    legal_count = sum(1 for keyword in legal_keywords if keyword in all_text)
    
    if scheme_count > legal_count:
        return "SCHEME"
    elif legal_count > scheme_count:
        return "CONSTITUTION"
    else:
        return "GENERAL"

def answer_scheme_question(question, context):
    """Answer using ACTUAL scheme data from database"""
    scheme_prompt = f"""
    You are a government scheme assistant. Use ONLY the database context below.
    
    DATABASE CONTEXT (real scheme data):
    {context}
    
    QUESTION: {question}
    
    Provide a comprehensive answer based on the REAL database information. Include:
    - Specific scheme names mentioned in the context
    - Eligibility criteria found in the data
    - Benefits information available
    - Application process details
    - Required documents if mentioned
    
    If the database doesn't contain specific information, say: "Based on the available database information, ..."
    """
    return answer(scheme_prompt, "")

def needs_form(question):
    """Check if question requires form generation - based on ACTUAL query"""
    form_keywords = ['apply', 'application', 'form', 'register', 'enroll', 'how to', 'process', 'procedure']
    return any(keyword in question.lower() for keyword in form_keywords)