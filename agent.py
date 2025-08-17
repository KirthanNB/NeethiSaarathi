from app.search import retrieve
from app.llm import answer
from app.actions import generate_rti, generate_scheme_form

async def run_agent(question: str):
    # 1. Planner
    plan = answer(question, "Classify this as LAW or SCHEME only.")
    # 2. Retrieve
    chunks = await retrieve(question, k=3)
    context = "\n".join(c.content for c in chunks)
    # 3. Answer
    answer_text = answer(question, context)
    # 4. Action
    if "SCHEME" in plan.upper():
        pdf_path = generate_scheme_form(question)
    else:
        pdf_path = generate_rti(question, context)
    # 5. Return
    return {"answer": answer_text, "file": pdf_path}