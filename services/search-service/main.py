import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.database import close_mongo_client, get_mongo_client
from app.routers import health, search  

# --- Startup/Shutdown Events ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # ---  Startup: Ensure MongoDB connection is ready --- 
    try:
        get_mongo_client()  # Test connection on startup
    except Exception as e:
        print(f"Warning: MongoDB connection failed on startup: {e}")
    yield
    # --- Shutdown: Close connections ----
    close_mongo_client()

app = FastAPI(
    title="Network AI Search Service",
    description="AI-native LinkedIn search microservice using Exa AI and Gemini.",
    version="1.0.0",
    lifespan=lifespan
)

# --- Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Mount Routers ---
app.include_router(health.router, prefix="/health")
app.include_router(search.router,)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )