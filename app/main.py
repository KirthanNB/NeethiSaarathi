from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from .routes import router
from .logging_config import setup_logging
from fastapi.middleware.cors import CORSMiddleware
from .questionnaire import router as questionnaire_router

# Setup logging
setup_logging()
app = FastAPI(title="NeethiSaarathi")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)
@router.options("/user/profile")
async def options_user_profile():
    return {"message": "OK"}

app.include_router(router, prefix="/api")
app.mount("/", StaticFiles(directory="app/static", html=True), name="static")
app.include_router(questionnaire_router, prefix="/api")
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    import logging
    logging.error(f"Global exception: {str(exc)}")
    return JSONResponse(status_code=500, content={"error": str(exc)})