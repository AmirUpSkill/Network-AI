from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Simple health check endpoint to verify the service is running."""
    return HealthResponse(
        status="healthy",
        service="resume-service",
        version="1.0.0"
    )

