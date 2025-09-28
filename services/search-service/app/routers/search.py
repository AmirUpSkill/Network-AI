from fastapi import APIRouter, HTTPException, status, Query, Depends
from typing import Optional
from app.models.search import SearchRequest, SearchResponse
from app.models.history import HistoryResponse
from app.services import exa_service, gemini_service ,  cache_service
from app.core.auth import get_current_user  

router = APIRouter(prefix="/search", tags=["search"])

@router.post("/linkedin", response_model=SearchResponse)
async def search_linkedin(
    request: SearchRequest,
    user_id: str = Depends(get_current_user) 
):
    try:
        enhanced_query = gemini_service.enhance_query(
            request.query, request.category.value, request.limit
        )
        response = exa_service.search_linkedin(
            query=enhanced_query,
            limit=request.limit,
            category=request.category.value,
            enhanced_query=enhanced_query if enhanced_query != request.query else None
        )

        # TODO: Save to MongoDB with user_id
        # await cache_service.save_search(user_id, request, response)

        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Search failed: {str(e)}"
        )

@router.get("/history", response_model=HistoryResponse)
async def get_search_history(
    limit: int = Query(default=10, ge=1, le=50),
    user_id: str = Depends(get_current_user) 
):
    # TODO: Implement with MongoDB
    return HistoryResponse(history=[])