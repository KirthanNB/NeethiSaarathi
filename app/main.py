from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from .routes import router
from .logging_config import setup_logging
from .questionnaire import router as questionnaire_router

# Setup logging
setup_logging()
app = FastAPI(title="NeethiSaarathi")

# ✅ COMPREHENSIVE CORS CONFIGURATION
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods including OPTIONS
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"]  # Expose all headers
)

app.include_router(router, prefix="/api")
app.include_router(questionnaire_router, prefix="/api")
app.mount("/", StaticFiles(directory="app/static", html=True), name="static")

# ✅ ADD EXPLICIT OPTIONS HANDLER AT APPLICATION LEVEL
@app.options("/api/{path:path}")
async def options_api_handler(path: str):
    return JSONResponse(status_code=200, headers={
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": "true"
    })

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    import logging
    logging.error(f"Global exception: {str(exc)}")
    return JSONResponse(status_code=500, content={"error": str(exc)})