# app/search.py  (ONNX-based, < 350 MB RAM, batch-size safe)
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import text
import numpy as np
from numpy.linalg import norm
import json
import logging
import threading
from pathlib import Path
import onnxruntime as ort
from transformers import AutoTokenizer

logger = logging.getLogger(__name__)

# ---------- 1.  local ONNX model ----------
MODEL_DIR = Path(__file__).parent.parent / "minilm_onnx"
MODEL_PATH = MODEL_DIR / "model.onnx"

_sess = ort.InferenceSession(str(MODEL_PATH), providers=["CPUExecutionProvider"])
_vocab_inp = _sess.get_inputs()[0].name
_tok = AutoTokenizer.from_pretrained(str(MODEL_DIR))

def _embed(texts: list[str]) -> np.ndarray:
    """Return 384-dim vectors (batch, 384) float32"""
    encoded = _tok(texts, padding=True, truncation=True, max_length=128, return_tensors="np")
    outputs = _sess.run(None, {
        _vocab_inp: encoded["input_ids"],
        "attention_mask": encoded["attention_mask"]
    })[0]
    # mean-pool
    mask = encoded["attention_mask"].astype(np.float32)
    pooled = (outputs * mask[:, :, np.newaxis]).sum(axis=1) / mask.sum(axis=1, keepdims=True)
    return pooled.astype(np.float32)

# ---------- 2.  your existing helpers ----------
def _profile_to_search_terms(profile: Optional[Dict]) -> str:
    if not profile:
        return ""
    terms = []
    if profile.get('state'):
        terms.append(profile['state'])
    if profile.get('occupation'):
        occ = profile['occupation'].lower()
        terms.append(occ)
        if 'student' in occ:
            terms.extend(["education", "scholarship", "student scheme"])
    if profile.get('social_category'):
        cat = profile['social_category'].lower()
        terms.append(cat)
        if any(x in cat for x in ('sc', 'st', 'obc')):
            terms.extend(["reservation", "social welfare"])
    if profile.get('has_disability'):
        terms.extend(["disability", "pwd scheme"])
    if profile.get('annual_income'):
        inc = profile['annual_income'].lower()
        if any(w in inc for w in ('low', 'below', 'poor')):
            terms.extend(["bpl", "subsidy", "financial aid"])
    return " ".join(terms)

def _calculate_content_quality_score(content: str) -> float:
    content_lower = content.lower()
    words = content.split()
    length_score = min(len(words) / 100, 2.0)
    penalty = 1.0
    for phrase in ['anyone can apply', 'open to all']:
        if phrase in content_lower:
            penalty *= 0.3
            break
    boost = 1.0
    for indicator, mult in [('financial assistance', 1.3), ('application process', 1.5), ('step by step', 1.6)]:
        if indicator in content_lower:
            boost *= mult
    return length_score * penalty * boost

def _enhance_query_for_search(original_query: str, user_profile: Optional[Dict]) -> str:
    enhanced = original_query.lower()
    if "schemes for me" in enhanced:
        enhanced += " specific eligibility criteria benefits application process required documents contact information"
    profile_terms = _profile_to_search_terms(user_profile)
    if profile_terms:
        enhanced += " " + profile_terms
    return enhanced

def _cosine_sim_matrix(q: np.ndarray, mat: np.ndarray, mat_norms: np.ndarray) -> np.ndarray:
    q_norm = norm(q)
    if q_norm == 0:
        return np.zeros((mat.shape[0],), dtype=np.float32)
    dots = mat @ q
    return dots / (mat_norms * q_norm)

# ---------- 3.  cache + mini-batch embedding ----------
_cache_lock = threading.Lock()
_cached_docs: List[Dict[str, Any]] = []
_cached_mat: Optional[np.ndarray] = None
_cached_norms: Optional[np.ndarray] = None
_cache_ready = False

def _build_cache(db: Session) -> None:
    global _cached_docs, _cached_mat, _cached_norms, _cache_ready
    with _cache_lock:
        if _cache_ready:
            return
        rows = db.execute(text("""
            SELECT id, source_type as source, title, content, chunk_metadata 
            FROM unified_chunks
        """)).fetchall()
        docs = [{"id": r.id, "source": r.source, "title": r.title,
                 "content": r.content, "metadata": r.chunk_metadata} for r in rows]
        if not docs:
            _cached_docs, _cached_mat, _cached_norms, _cache_ready = [], np.empty((0, 384), dtype=np.float32), np.empty(0, dtype=np.float32), True
            return

        # ---- embed in mini-batches (≤ 64) ----
        batch_size = 64
        all_embs = []
        texts = [d["content"] for d in docs]
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            all_embs.append(_embed(batch))
        embs = np.vstack(all_embs)
        norms = np.linalg.norm(embs, axis=1)

        _cached_docs, _cached_mat, _cached_norms, _cache_ready = docs, embs, norms, True

def _ensure_cache(db: Session) -> None:
    if not _cache_ready:
        _build_cache(db)

# ---------- 4.  retrieve (signature identical) ----------
def retrieve(query: str,
             k: int = 5,
             db: Session | None = None,
             user_profile: Optional[Dict] = None) -> List[Dict[str, Any]]:
    if db is None:
        raise ValueError("Database session required")
    if not query or not query.strip():
        raise ValueError("Query cannot be empty")
    if k <= 0:
        raise ValueError("k must be positive")

    _ensure_cache(db)
    if _cached_mat is None or _cached_mat.shape[0] == 0:
        return []

    enhanced_query = _enhance_query_for_search(query, user_profile)
    logger.info(f"Enhanced query: '{enhanced_query}'")

    q_vec = _embed([enhanced_query])[0]
    sims = _cosine_sim_matrix(q_vec, _cached_mat, _cached_norms)

    top_k_candidates = min(len(sims), k * 3)
    top_idx = np.argsort(sims)[-top_k_candidates:][::-1]

    scored_results = []
    for i in top_idx:
        chunk = _cached_docs[i]
        similarity_score = sims[i]
        quality_score = _calculate_content_quality_score(chunk['content'])

        # profile boost (your original logic)
        profile_boost = 1.0
        if user_profile:
            metadata = chunk.get('metadata', {})
            if isinstance(metadata, str):
                try:
                    metadata = json.loads(metadata)
                except Exception:
                    metadata = {}
            if user_profile.get('state') and metadata.get('level') == 'State':
                profile_boost *= 1.3
            if user_profile.get('occupation') == 'student' and 'education' in str(metadata.get('category', '')).lower():
                profile_boost *= 2.0

        final_score = similarity_score * quality_score * profile_boost
        scored_results.append({'chunk': chunk, 'final_score': final_score})

    scored_results.sort(key=lambda x: x['final_score'], reverse=True)
    final_results = [res['chunk'] for res in scored_results[:k]]

    logger.info(f"Top {min(3, len(final_results))} results:")
    for i, res in enumerate(final_results[:3]):
        logger.info(f"  {i+1}. Score: {scored_results[i]['final_score']:.3f} - {res['content'][:100]}...")
    return final_results
