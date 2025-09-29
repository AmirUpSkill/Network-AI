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

# --- Metadata --- 
class SearchMetadata(BaseModel):
    """
    Contains metadata about the search operation 
    """
    total_results: int 
    search_time_ms: float 
    enhanced_query: Optional[str] = None 

# --- Raw Exa Response Models ---
class ExaSearchResponse(BaseModel):
    """
    Model representing the raw response from Exa API.
    """
    results: List[PersonResult]
    auto_date: Optional[str] = None
    autoprompt_string: Optional[str] = None
    resolved_search_type: Optional[str] = None
    cost_dollars: Optional[dict] = None  
    
    @classmethod
    def from_exa_response(cls, exa_response) -> 'ExaSearchResponse':
        """
        Factory method to create ExaSearchResponse from Exa API response object.
        Handles both Result objects and dictionary formats.
        """
        # ---  Lazy import to break circular dependency --- 
        from app.models.parsers import PersonResultParser
        
        # ---  Parse results using the dedicated parser ----
        parsed_results = PersonResultParser.parse_results(exa_response.results)
        
        cost_dollars = getattr(exa_response, 'cost_dollars', None)
        if cost_dollars is not None:
            if hasattr(cost_dollars, '__dict__'):
                cost_dollars = cost_dollars.__dict__.copy()  
            elif isinstance(cost_dollars, dict):  
                pass
            else:
                cost_dollars = {}  
        
        return cls(
            results=parsed_results,
            auto_date=getattr(exa_response, 'auto_date', None),
            autoprompt_string=getattr(exa_response, 'autoprompt_string', None),
            resolved_search_type=getattr(exa_response, 'resolved_search_type', None),
            cost_dollars=cost_dollars  
        )

class SearchResponse(BaseModel):
    """
    The final response structure for the /search/linkedin endpoint.
    """
    results: List[PersonResult]
    metadata: SearchMetadata
    
    @classmethod
    def from_exa_response(cls, exa_response, enhanced_query: Optional[str] = None) -> 'SearchResponse':
        """
        Factory method to create SearchResponse from ExaSearchResponse.
        """
        exa_search_response = ExaSearchResponse.from_exa_response(exa_response)
        
        metadata = SearchMetadata(
            total_results=len(exa_search_response.results),
            search_time_ms=0.0,  
            enhanced_query=enhanced_query
        )
        
        return cls(
            results=exa_search_response.results,
            metadata=metadata
        )