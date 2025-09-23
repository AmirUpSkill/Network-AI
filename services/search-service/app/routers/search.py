from fastapi import APIRouter, HTTPException, status, Query
from typing import Optional
from app.models.search import SearchRequest, SearchResponse
from app.models.history import HistoryResponse
from app.services import exa_service, gemini_service, cache_service
from app.core.security import get_current_user  

router = APIRouter(prefix="/search", tags=["search"])

@router.post("/linkedin", response_model=SearchResponse, summary="LinkedIn Semantic Search")
async def search_linkedin(request: SearchRequest):
    """
    Perform an AI-native search on LinkedIn entities.
    
    - Enhances query with Gemini (if key available).
    - Searches via Exa AI.
    - Caching/history skipped (no auth for MVP).
    """
    try:
        # ---  Step 1: Enhance query with Gemini ---
        enhanced_query = gemini_service.enhance_query(
            request.query, request.category.value, request.limit
        )
        
        # ---  Step 2: Perform Exa search ---
        response = exa_service.search_linkedin(
            query=enhanced_query,
            limit=request.limit,
            category=request.category.value,
            enhanced_query=enhanced_query if enhanced_query != request.query else None
        )
        
        # ---  Step 3: Skip caching (no user_id for MVP) ---
        # TODO: Re-enable when auth is added
        # user_id = await get_current_user()
        # if user_id:
        #     cache_service.save_search(...)
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Search failed: {str(e)}"
        )

@router.get("/history", response_model=HistoryResponse, summary="User Search History")
async def get_search_history(
    limit: int = Query(default=10, ge=1, le=50)
):
    """
    Retrieve search history.
    For MVP (no auth): Returns empty list.
    Later: Requires user_id for personalized history.
    """
    # Skip auth check; return empty for now
    # TODO: Add user_id dependency and cache_service.get_history(user_id, limit)
    return HistoryResponse(history=[]) 