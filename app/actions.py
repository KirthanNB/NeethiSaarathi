import os, tempfile, json

def generate_rti(question: str, context: str) -> str:
    with tempfile.NamedTemporaryFile(mode="w", suffix=".md", delete=False) as f:
        f.write(f"# RTI Draft\n**Query:** {question}\n**Relevant Sections:**\n{context}\n")
    return f.name

def generate_scheme_form(question: str) -> str:
    with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
        json.dump({"scheme": question, "autoFilled": True}, f)
    return f.name