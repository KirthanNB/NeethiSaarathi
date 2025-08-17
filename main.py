from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.routes import router

app = FastAPI()
app.include_router(router)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"error": str(exc)})
