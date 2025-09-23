from pydantic import BaseModel, Field
from typing import List
from datetime import datetime

# --- History Item Model ---
class HistoryItem(BaseModel):
    """
    Represents a single entry in the user's search history.
    Stored in MongoDB with user_id as the collection key.
    """
    query: str = Field(
        ..., 
        description="The original natural language search query.",
        min_length=3,
        max_length=500
    )
    timestamp: datetime = Field(
        ..., 
        description="ISO date-time when the search was performed."
    )
    results_count: int = Field(
        ..., 
        ge=0, 
        description="Number of results returned for this query."
    )

    class Config:
        # Ensure datetime serializes to ISO string in JSON
        json_encoders = {datetime: lambda v: v.isoformat()}

# --- Response Model ---
class HistoryResponse(BaseModel):
    """
    The response structure for the /search/history endpoint.
    Returns the user's recent searches (limited by query param).
    """
    history: List[HistoryItem] = Field(
        default_factory=list, 
        description="Array of recent search history items."
    )