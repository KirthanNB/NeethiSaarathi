from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import text
import numpy as np
from numpy.linalg import norm
import threading

# Embedding model (SentenceTransformers)
from sentence_transformers import SentenceTransformer

# Load once (small model, ~80MB)
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
    """Load all chunks from DB and build embedding cache."""
    global _cached_docs, _cached_mat, _cached_norms, _cache_ready

    with _cache_lock:
        if _cache_ready:
            return

        # Only select the columns we need (avoid embedding blob)
        rows = db.execute(text("SELECT id, source, title, content FROM chunks")).fetchall()

        docs = []
        texts = []
        for r in rows:
            d = {"id": r.id, "source": r.source, "title": r.title, "content": r.content}
            docs.append(d)
            texts.append(r.content)

        if not texts:
            _cached_docs = []
            _cached_mat = np.zeros((0, 384), dtype=np.float32)  # model dim
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
    if not _cache_ready:
        _build_cache(db)


def retrieve(query: str, k: int = 5, db: Session | None = None) -> List[Dict[str, Any]]:
    """
    Return top-k documents (dicts with id, source, title, content)
    using local cosine similarity on cached embeddings.
    """
    if db is None:
        raise ValueError("Database session required")
    if not query or not query.strip():
        raise ValueError("Query cannot be empty")
    if k <= 0:
        raise ValueError("k must be positive")

    _ensure_cache(db)

    # If there are no docs in DB
    if _cached_mat is None or _cached_mat.shape[0] == 0:
        return []

    # Embed the query
    q_vec = _EMB_MODEL.encode(query, convert_to_numpy=True).astype(np.float32)

    # Cosine similarity against cached matrix
    sims = _cosine_sim_matrix(q_vec, _cached_mat, _cached_norms)
    # Top-k indices
    top_idx = np.argsort(sims)[-k:][::-1]

    results = [ _cached_docs[i] for i in top_idx ]
    return results
