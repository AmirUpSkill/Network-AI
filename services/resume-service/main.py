import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.routers import health, resume

# --- Configure logging ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

#  --- FastAPI app instance ---
app = FastAPI(
    title="Resume Service API",
    description="A service for uploading resumes and generating AI-powered analysis reports against job postings.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---- CORS middleware ----
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---  Mount routers ---
app.include_router(health.router, tags=["Health"])
app.include_router(resume.router, tags=["Resume"])

# ---  Global exception handler for unhandled errors ----
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again later."},
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8002,
        reload=True, 
        log_level="info",
    )