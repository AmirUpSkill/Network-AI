from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum
from datetime import datetime

# --- Enums for strict category validation ---
class SearchCategory(str, Enum):
    """
    Enumeration for the different search categories, aligned with Exa API.
    Based on the vision for a LinkedIn networking tool.
    """
    LINKEDIN_PROFILE = "linkedin profile"
    COMPANY = "company"
    # we will add later more 
# --- Request Models --- 
class SearchRequest(BaseModel):
    """
    Pydantic model for the search request body.
    Validates the input for the /search/linkedin endpoint.
    """
    query: str = Field(
        ..., 
        description="Natural language search query.",
        min_length=3,
        max_length=500
    )
    category: SearchCategory = Field(
        default=SearchCategory.LINKEDIN_PROFILE, 
        description="The type of LinkedIn entity to search for."
    )
    limit: int = Field(
        default=10, 
        ge=1, 
        le=50, 
        description="The maximum number of results to return."
    )
# --- Nested Response Models --- 
class WorkExperienceItem(BaseModel):
    """Represents a single entry in a person's work history."""
    title: Optional[str] = None
    company: Optional[str] = None
    duration: Optional[str] = None
    location: Optional[str] = None

class EducationItem(BaseModel):
    """Represents a single entry in a person's education history."""
    institution: Optional[str] = None
    degree: Optional[str] = None
    field_of_study: Optional[str] = None

# --- Main Result Models --- 
class PersonResult(BaseModel):
    """
    Represents a single person profile result from the search.
    This is the clean, structured version of the raw Exa result.
    """
    id: str
    url: str
    title: Optional[str] = None
    author: Optional[str] = None
    location: Optional[str] = None
    summary: Optional[str] = None
    image: Optional[str] = None
    work_experience: List[WorkExperienceItem] = []
    education: List[EducationItem] = []
    skills: List[str] = []
# --- For now we only had for Linkedin Profile later we can add more personlise ones ---- 

# --- Metadata --- 
class SearchMetadata(BaseModel):
    """
        Contains metadata about the search operation 
    """
    total_results: int 
    search_time_ms: float 
    enhanced_query: Optional[str] = None 
class SearchResponse(BaseModel):
    """
        The final response structure for the /search/linkedin endpoint.
    """
    results: List[PersonResult]
    metadata: SearchMetadata