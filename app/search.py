from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import text
import numpy as np
from numpy.linalg import norm
import threading
from sentence_transformers import SentenceTransformer
import re
import logging

logger = logging.getLogger(__name__)

# Embedding model
_EMB_MODEL = SentenceTransformer("all-MiniLM-L6-v2")

# Thread-safe globals for cache
_cache_lock = threading.Lock()
_cached_docs: List[Dict[str, Any]] = []
_cached_mat: np.ndarray | None = None
_cached_norms: np.ndarray | None = None
_cache_ready = False

def _cosine_sim_matrix(q: np.ndarray, mat: np.ndarray, mat_norms: np.ndarray) -> np.ndarray:
    """Compute cosine sim between query vector and all doc vectors (fast)."""
    q_norm = norm(q)
    if q_norm == 0:
        return np.zeros((mat.shape[0],), dtype=np.float32)
    dots = mat @ q
    return dots / (mat_norms * q_norm)

def _build_cache(db: Session) -> None:
    """Load all chunks from unified_chunks table"""
    global _cached_docs, _cached_mat, _cached_norms, _cache_ready

    with _cache_lock:
        if _cache_ready:
            return

        # Query unified_chunks table
        rows = db.execute(text("""
            SELECT id, source_type as source, title, content, chunk_metadata 
            FROM unified_chunks
        """)).fetchall()

        docs = []
        texts = []
        for r in rows:
            d = {
                "id": r.id, 
                "source": r.source,
                "title": r.title,
                "content": r.content,
                "metadata": r.chunk_metadata
            }
            docs.append(d)
            texts.append(r.content)

        if not texts:
            _cached_docs = []
            _cached_mat = np.zeros((0, 384), dtype=np.float32)
            _cached_norms = np.zeros((0,), dtype=np.float32)
            _cache_ready = True
            return

        # Embed all documents
        embs = _EMB_MODEL.encode(texts, show_progress_bar=False, batch_size=64, convert_to_numpy=True)
        embs = embs.astype(np.float32)
        norms = np.linalg.norm(embs, axis=1)

        _cached_docs = docs
        _cached_mat = embs
        _cached_norms = norms
        _cache_ready = True

def _ensure_cache(db: Session) -> None:
    """Ensure cache is built before querying"""
    if not _cache_ready:
        _build_cache(db)

def _profile_to_search_terms(profile: Dict) -> str:
    """Convert user profile to additional search terms for better personalization"""
    if not profile:
        return ""
    
    terms = []
    
    # State-based filtering
    if profile.get('state'):
        terms.append(profile['state'])
        terms.append(f"{profile['state']} state")
    
    # Occupation-based terms
    if profile.get('occupation'):
        occupation = profile['occupation'].lower()
        terms.append(occupation)
        if 'student' in occupation:
            terms.extend(["education", "scholarship", "student scheme", "college", "university", "academic"])
        elif 'farmer' in occupation:
            terms.extend(["agriculture", "farmer scheme", "crop", "subsidy", "farming", "rural"])
        elif 'business' in occupation:
            terms.extend(["business", "enterprise", "loan", "startup", "entrepreneur"])
        elif 'employed' in occupation or 'job' in occupation:
            terms.extend(["employment", "job", "skill development", "career"])
    
    # Social category terms
    if profile.get('social_category'):
        social_cat = profile['social_category'].lower()
        terms.append(social_cat)
        if 'sc' in social_cat or 'st' in social_cat or 'obc' in social_cat:
            terms.extend(["reservation", "social welfare", "minority scheme", "backward class"])
    
    # Disability terms
    if profile.get('has_disability'):
        terms.extend(["disability", "differently abled", "pwd scheme", "accessibility", "special needs"])
    
    # Income-based terms
    if profile.get('annual_income'):
        income = profile['annual_income'].lower()
        if 'low' in income or 'below' in income or 'poor' in income:
            terms.extend(["poverty", "below poverty line", "bpl", "subsidy", "financial aid"])
        elif 'middle' in income:
            terms.extend(["middle class", "affordable", "moderate income"])
    
    # Education level terms
    if profile.get('education_level'):
        terms.append(profile['education_level'])
        if 'graduate' in profile['education_level'].lower():
            terms.extend(["higher education", "postgraduate", "masters", "phd"])
        elif 'undergraduate' in profile['education_level'].lower():
            terms.extend(["college", "bachelor", "degree", "university"])
    
    # Field of study terms
    if profile.get('field_of_study'):
        field = profile['field_of_study'].lower()
        terms.append(field)
        if 'computer' in field or 'tech' in field:
            terms.extend(["technology", "IT", "software", "programming", "digital"])
        elif 'engineering' in field:
            terms.extend(["engineer", "technical", "STEM"])
    
    # Academic performance terms
    if profile.get('grades'):
        if float(profile['grades'].replace('CGPA', '').strip()) >= 8.0:
            terms.extend(["merit", "excellence", "scholarship", "achievement"])
    
    return " ".join(terms)

def _calculate_content_quality_score(content: str) -> float:
    """Calculate quality score for content to prioritize better chunks"""
    content_lower = content.lower()
    words = content.split()
    
    # Base score based on content length (longer is generally better)
    length_score = min(len(words) / 100, 2.0)  # Cap at 2.0
    
    # Penalize generic eligibility phrases
    penalty_score = 1.0
    generic_phrases = [
        'anyone can apply', 'everyone is eligible', 'all citizens',
        'no specific eligibility', 'open to all', 'any person'
    ]
    for phrase in generic_phrases:
        if phrase in content_lower:
            penalty_score *= 0.3  # Severe penalty for generic content
            break
    
    # Boost for rich content
    boost_score = 1.0
    quality_indicators = [
        ('financial assistance', 1.3),
        ('subsidy', 1.2),
        ('benefit', 1.2),
        ('document', 1.4),
        ('required', 1.3),
        ('application process', 1.5),
        ('step by step', 1.6),
        ('eligibility criteria', 1.4),
        ('contact information', 1.3),
        ('website', 1.2),
        ('portal', 1.2)
    ]
    
    for indicator, boost in quality_indicators:
        if indicator in content_lower:
            boost_score *= boost
    
    return length_score * penalty_score * boost_score

def _enhance_query_for_search(original_query: str, user_profile: Dict = None) -> str:
    """Transform user query for better search results"""
    enhanced = original_query.lower()
    
    # Add context based on query type
    if "schemes for me" in enhanced or "for me" in enhanced:
        enhanced += " specific eligibility criteria benefits application process required documents contact information"
    
    if "scholarship" in enhanced or "education" in enhanced:
        enhanced += " student academic merit financial support"
    
    # Add profile context
    profile_terms = _profile_to_search_terms(user_profile)
    if profile_terms:
        enhanced += " " + profile_terms
    
    return enhanced

def retrieve(query: str, k: int = 5, db: Session | None = None, user_profile: Dict = None) -> List[Dict[str, Any]]:
    """
    Return top-k documents using local cosine similarity on cached embeddings.
    Enhanced with user profile context and content quality scoring.
    """
    if db is None:
        raise ValueError("Database session required")
    if not query or not query.strip():
        raise ValueError("Query cannot be empty")
    if k <= 0:
        raise ValueError("k must be positive")

    _ensure_cache(db)

    if _cached_mat is None or _cached_mat.shape[0] == 0:
        return []

    # Enhance query with user profile context and search optimization
    enhanced_query = _enhance_query_for_search(query, user_profile)
    logger.info(f"Enhanced query: '{enhanced_query}'")

    # Embed the enhanced query
    q_vec = _EMB_MODEL.encode(enhanced_query, convert_to_numpy=True).astype(np.float32)

    # Cosine similarity against cached matrix
    sims = _cosine_sim_matrix(q_vec, _cached_mat, _cached_norms)
    
    # Get top candidates (more than requested to allow for filtering)
    top_k_candidates = min(len(sims), k * 3)  # Get 3x more candidates for filtering
    top_idx = np.argsort(sims)[-top_k_candidates:][::-1]
    
    # Apply content quality scoring and filtering
    scored_results = []
    for i in top_idx:
        chunk = _cached_docs[i]
        similarity_score = sims[i]
        
        # Calculate content quality score
        content_quality_score = _calculate_content_quality_score(chunk['content'])
        
        # Apply profile-based boosting
        profile_boost = 1.0
        if user_profile:
            # Parse metadata for better matching
            metadata = chunk.get('metadata', {})
            if isinstance(metadata, str):
                try:
                    metadata = json.loads(metadata)
                except:
                    metadata = {}
            
            # Boost schemes that match user's state
            if user_profile.get('state') and metadata.get('level') == 'State':
                profile_boost *= 1.3
            
            # Boost student-relevant content for students
            if user_profile.get('occupation') == 'student':
                if 'education' in str(metadata.get('category', '')).lower():
                    profile_boost *= 2.0
                if 'scholarship' in chunk['content'].lower():
                    profile_boost *= 1.8
        
        # Final score combining similarity and quality
        final_score = similarity_score * content_quality_score * profile_boost
        
        scored_results.append({
            'chunk': chunk,
            'similarity_score': similarity_score,
            'quality_score': content_quality_score,
            'final_score': final_score
        })
    
    # Sort by final score and take top k
    scored_results.sort(key=lambda x: x['final_score'], reverse=True)
    final_results = [result['chunk'] for result in scored_results[:k]]
    
    # Log debugging information
    logger.info(f"Top {min(3, len(final_results))} results:")
    for i, result in enumerate(final_results[:3]):
        content_preview = result['content'][:100] + "..." if len(result['content']) > 100 else result['content']
        logger.info(f"  {i+1}. Score: {scored_results[i]['final_score']:.3f} - {content_preview}")
    
    return final_results
