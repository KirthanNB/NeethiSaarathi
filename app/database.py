from sqlalchemy import create_engine, text  # ADD text import here
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from pathlib import Path
import urllib.parse

# Load environment variables
load_dotenv()

# ---- TiDB Cloud Configuration ----
TIDB_HOST = os.getenv("TIDB_HOST","gateway01.ap-southeast-1.prod.aws.tidbcloud.com")
TIDB_PORT = os.getenv("TIDB_PORT","4000")
TIDB_USER = os.getenv("TIDB_USER","34Pmbpy1H3sw7oU.root")
TIDB_PASSWORD = os.getenv("TIDB_PASSWORD","r1KYLhwbVr5E3u1C")
TIDB_DATABASE = os.getenv("TIDB_DATABASE","test")

# URL-encode password
encoded_password = urllib.parse.quote_plus(TIDB_PASSWORD)
DATABASE_URL = f"mysql+pymysql://{TIDB_USER}:{encoded_password}@{TIDB_HOST}:{TIDB_PORT}/{TIDB_DATABASE}"

# Get current directory and find SSL certificate
current_dir = Path(__file__).parent
CA_PATH = str(current_dir / "isrgrootx1.pem")

# Check if certificate exists
if not os.path.exists(CA_PATH):
    print(f"❌ SSL certificate not found at: {CA_PATH}")
    print("Please download it with: curl -o app/isrgrootx1.pem https://letsencrypt.org/certs/isrgrootx1.pem")
    # Fallback to without SSL (not recommended)
    engine = create_engine(DATABASE_URL)
else:
    print(f"✅ Using SSL certificate: {CA_PATH}")
    engine = create_engine(
        DATABASE_URL,
        connect_args={
            "ssl": {
                "ca": CA_PATH,
                "check_hostname": True,
            }
        },
        pool_pre_ping=True,
        pool_recycle=300,
        pool_timeout=30,
        pool_size=5,
        max_overflow=2,
        echo=True,  # Enable SQL echo for debugging
    )

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
    bind=engine
)

def get_db():
    db = SessionLocal()
    try:
        # Test connection with text function
        db.execute(text("SELECT 1"))
        yield db
    except Exception as e:
        print(f"Database connection error: {e}")
        db.close()
        raise
    finally:
        try:
            db.close()
        except:
            pass