from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# ---- TiDB Cloud (Serverless) connection ----
# Keep your existing URL
DATABASE_URL = "mysql+pymysql://2UKryQY2xjKAPbg.root:6SqoslthiJYnEbIx@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/test"

# CA certificate (what you already downloaded)
CA_PATH = os.path.join(os.path.dirname(__file__), "ca.pem")

engine = create_engine(
    DATABASE_URL,
    connect_args={
        "ssl": {
            "ca": CA_PATH,
            "check_hostname": True,
        }
    },
    pool_pre_ping=True,
    pool_recycle=3600,   # avoids stale connections
    pool_timeout=600,    # wait longer if pool busy
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
