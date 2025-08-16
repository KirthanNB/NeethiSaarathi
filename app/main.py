from fastapi import FastAPI
from app.models import Base, engine
app = FastAPI()
Base.metadata.create_all(bind=engine)  # auto-create table