from exa_py import Exa
from app.core.config import settings
from app.models.search import SearchResponse
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class ExaService:
    """
    Service for interacting with the Exa AI API.
    Handles LinkedIn-focused searches with text extraction for parsing.
    Delegates structured parsing to model factory methods.
    """
    
    def __init__(self):
        if not settings.exa_api_key:
            raise ValueError("EXA_API_KEY is required for ExaService")
        self.client = Exa(api_key=settings.exa_api_key)

    def search_linkedin(
        self,
        query: str,
        limit: int = 10,
        category: str = "linkedin profile",
        enhanced_query: Optional[str] = None
    ) -> SearchResponse:
        """
        Perform a semantic search focused on LinkedIn entities using Exa AI.
        
        Args:
            query: The search query string (enhanced or original).
            limit: Maximum number of results (1-50, maps to num_results).
            category: Exa category filter (default: "linkedin profile").
            enhanced_query: Original enhanced query for metadata (if different from query).
            
        Returns:
            SearchResponse: Structured results with parsed PersonResult objects and metadata.
            
        Raises:
            ValueError: If invalid params (e.g., limit > 50).
            Exception: If Exa API call fails (e.g., rate limit, network error).
        """
        if limit < 1 or limit > 50:
            raise ValueError("Limit must be between 1 and 50")
        
        if category not in ["linkedin profile", "company", "job offers", "pages"]:  # Align with app categories
            logger.warning(f"Unsupported category '{category}'; defaulting to 'linkedin profile'")
            category = "linkedin profile"
        
        try:
            # --- Exa Call  ----
            exa_response = self.client.search_and_contents(
                query=query,
                type="auto",  
                category=category,
                num_results=limit,
                text=True, 
            )
            
            logger.info(f"Exa search successful: {len(exa_response.results)} results for query '{query[:50]}...'")
            
            return SearchResponse.from_exa_response(exa_response, enhanced_query)
            
        except Exception as e:
            logger.error(f"Exa search failed for query '{query[:50]}...': {str(e)}")
            raise

exa_service = ExaService()