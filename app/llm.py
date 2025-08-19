import ollama

def answer(question: str, context: str) -> str:
    prompt = (
        "You are a helpful Indian legal assistant. "
        "Use only the context below. If an answer isn't in the context, say you don't know. "
        "Cite relevant Articles/Sections when available.\n\n"
        f"Context:\n{context}\n\n"
        f"Question: {question}\n"
        "Answer:"
    )
    res = ollama.chat(
        model="gpt-oss:20b",
        messages=[{"role": "user", "content": prompt}],
        options={"num_ctx": 8192},  # if your model supports larger context
    )
    return res["message"]["content"]
