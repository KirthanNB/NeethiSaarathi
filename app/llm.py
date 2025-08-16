import ollama

def answer(question: str, context: str) -> str:
    prompt = f"You are a helpful Indian legal assistant. Use only the context below. Cite sections.\n\nContext:\n{context}\n\nQuestion: {question}\nAnswer:"
    res = ollama.chat(model="gpt-oss-20b", messages=[{"role": "user", "content": prompt}])
    return res["message"]["content"]