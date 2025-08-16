# db_check.py
from sqlalchemy import create_engine, inspect

def check_connection(db_url):
    try:
        engine = create_engine(db_url)
        inspector = inspect(engine)
        print(f"\nChecking: {db_url}")
        print("Tables found:", inspector.get_table_names())
        return True
    except Exception as e:
        print(f"Connection failed: {str(e)}")
        return False

# Test possible database URLs
db_urls = [
    "sqlite:///test.db",          # Common SQLite path
    "sqlite:///db/test.db",       # In a db subdirectory
    "mysql+pymysql://user:pass@localhost/test",  # MySQL example
    "postgresql://user:pass@localhost/test"      # PostgreSQL example
]

for url in db_urls:
    if check_connection(url):
        print(f"✅ Working connection at: {url}")
        break