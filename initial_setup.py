import os
from sqlalchemy import create_engine
from app.models import Base
from dotenv import load_dotenv

load_dotenv()

# Get absolute path to CA cert
ca_path = os.path.join(os.path.dirname(__file__), 'cacert.pem')

engine = create_engine(
    os.getenv("TIDB_URL"),
    connect_args={
        "ssl": {
            "ca": ca_path,
            "check_hostname": True
        }
    },
    echo=True  # Show SQL queries for debugging
)

try:
    with engine.connect() as conn:
        Base.metadata.create_all(conn.engine)
        print("✅ Tables created successfully")
except Exception as e:
    print(f"❌ Error: {e}")
    print("Verify:")
    print("1. CA cert exists at:", ca_path)
    print("2. TiDB credentials in .env are correct")
    print("3. Your IP is whitelisted in TiDB Cloud")