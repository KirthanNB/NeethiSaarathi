# test_imports.py in your app folder
try:
    from agent import run_agent
    from database import get_db
    from search import retrieve
    from llm import answer
    print("✅ All imports work!")
except ImportError as e:
    print(f"❌ Import error: {e}")