import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.core.database import close_mongo_client, get_mongo_client
from app.routers import health, search

# Basic logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Startup/Shutdown Events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure MongoDB connection is ready
    try:
        get_mongo_client()  # Test connection on startup
        logger.info("MongoDB connection established")
    except Exception as e:
        logger.warning(f"MongoDB connection failed on startup: {e}")
    yield
    # Shutdown: Close connections
    close_mongo_client()
    logger.info("MongoDB connection closed")

app = FastAPI(
    title="Network AI Search Service",
    description="AI-native LinkedIn search microservice using Exa AI and Gemini.",
    version="1.0.0",
    lifespan=lifespan
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend dev origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*", "Authorization"],  # Allow Authorization header
)

# Mount Routers
app.include_router(health.router)
app.include_router(search.router)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )