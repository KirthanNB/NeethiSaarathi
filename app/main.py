from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from app.routes import router  # your existing API routes

# Initialize FastAPI app
app = FastAPI(title="NeethiSaarathi")

# Include API routes with prefix
app.include_router(router, prefix="/api")

# Mount static frontend files (React/Next.js build)
app.mount("/", StaticFiles(directory="app/static", html=True), name="static")

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"error": str(exc)})