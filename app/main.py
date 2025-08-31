from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from .routes import router
from .logging_config import setup_logging

# Setup logging
setup_logging()

app = FastAPI(title="NeethiSaarathi")
app.include_router(router, prefix="/api")
app.mount("/", StaticFiles(directory="app/static", html=True), name="static")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    import logging
    logging.error(f"Global exception: {str(exc)}")
    return JSONResponse(status_code=500, content={"error": str(exc)})