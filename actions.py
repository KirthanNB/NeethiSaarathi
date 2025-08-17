from datetime import datetime
import os

def generate_rti(question: str, context: str) -> str:
    filename = f"RTI_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(f"RTI Application\nQuery: {question}\nRelevant sections:\n{context}\n")
    return filename

def generate_scheme_form(question: str) -> str:
    filename = f"SCHEME_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(f"Auto-filled scheme form for: {question}\n")
    return filename