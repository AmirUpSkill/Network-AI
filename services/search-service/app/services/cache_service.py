import hashlib
import logging
from datetime import datetime, timedelta
from typing import Optional, List
from pymongo import DESCENDING
from pymongo.errors import DuplicateKeyError, PyMongoError
from app.core.database import get_database
from app.models.history import HistoryItem

logger = logging.getLogger(__name__)

class CacheService:
    """
    Service for caching search results and managing user history.
    Uses two collections: user_searches (lightweight history) and search_cache (full results, TTL 24h).
    """
    
    def __init__(self, db_name: str = "networkai_search"):
        """
        Initialize with database and ensure indexes.
        
        Args:
            db_name: MongoDB database name.
        """
        self.db = get_database(db_name)
        self.user_searches = self.db["user_searches"]
        self.search_cache = self.db["search_cache"]
        self._ensure_indexes()
    
    def _ensure_indexes(self):
        """Create required indexes for performance and TTL."""
        try:
            # ---  History: Compound index for efficient queries ---
            self.user_searches.create_index(
                [("user_id", 1), ("timestamp", DESCENDING)],
                name="user_timestamp_idx"
            )
            
            # ---   History: Unique on user_id + query_hash to prevent duplicates ---
            self.user_searches.create_index(
                [("user_id", 1), ("query_hash", 1)],
                unique=True,
                name="user_query_unique_idx"
            )
            
            # ---  Cache: TTL index for auto-expiration (24h from insert) ---
            self.search_cache.create_index(
                [("expires_at", 1)],
                expireAfterSeconds=0,  
                name="ttl_idx"
            )
            
            # ---  Cache: Compound for quick lookups ---
            self.search_cache.create_index(
                [("user_id", 1), ("query_hash", 1)],
                name="user_query_cache_idx"
            )
            
            logger.info("Cache indexes created/verified successfully")
        except PyMongoError as e:
            logger.error(f"Failed to create indexes: {e}")
            raise
    
    def save_search(
        self,
        user_id: str,
        query: str,
        results_count: int,
        category: str = "linkedin profile",
        enhanced_query: Optional[str] = None,
        full_results: Optional[list] = None 
    ) -> bool:
        """
        Save search metadata to history and optionally full results to cache.
        
        Args:
            user_id: Authenticated user ID from JWT.
            query: Original search query.
            results_count: Number of results returned.
            category: Search category.
            enhanced_query: Gemini-enhanced query (if used).
            full_results: List of PersonResult objects (for caching).
        
        Returns:
            bool: True if saved successfully (or duplicate skipped gracefully).
        
        Raises:
            PyMongoError: On connection/write failures.
        """
        timestamp = datetime.utcnow()
        query_hash = hashlib.sha256(query.encode('utf-8')).hexdigest()[:16]  
        
        history_doc = {
            "user_id": user_id,
            "query": query,
            "query_hash": query_hash,
            "timestamp": timestamp,
            "results_count": results_count,
            "category": category,
            "enhanced_query": enhanced_query
        }
        
        try:
            #  --- Insert history ---
            self.user_searches.replace_one(
                {"user_id": user_id, "query_hash": query_hash},
                history_doc,
                upsert=True
            )
            
            # --- Optionally cache full results ---
            if full_results:
                cache_doc = {
                    "user_id": user_id,
                    "query_hash": query_hash,
                    "results": [r.dict() for r in full_results],  
                    "expires_at": timestamp + timedelta(hours=24)
                }
                self.search_cache.replace_one(
                    {"user_id": user_id, "query_hash": query_hash},
                    cache_doc,
                    upsert=True
                )
            
            logger.info(f"Saved search history for user {user_id}: {query[:50]}...")
            return True
            
        except DuplicateKeyError:
            logger.warning(f"Duplicate search skipped for user {user_id}: {query_hash}")
            return True  
        except PyMongoError as e:
            logger.error(f"Failed to save search for user {user_id}: {e}")
            raise
    
    def get_history(self, user_id: str, limit: int = 10) -> List[HistoryItem]:
        """
        Retrieve recent search history for a user.
        
        Args:
            user_id: Authenticated user ID.
            limit: Max items to return (1-50).
        
        Returns:
            List[HistoryItem]: Sorted by timestamp descending.
        """
        if limit < 1 or limit > 50:
            raise ValueError("Limit must be between 1 and 50")
        
        try:
            docs = self.user_searches.find(
                {"user_id": user_id},
                sort=[("timestamp", DESCENDING)],
                limit=limit,
                projection={"_id": 0}  
            )
            
            history = [
                HistoryItem(**doc) for doc in docs
            ]
            
            logger.info(f"Retrieved {len(history)} history items for user {user_id}")
            return history
            
        except PyMongoError as e:
            logger.error(f"Failed to get history for user {user_id}: {e}")
            raise
    
    def get_cached_results(self, user_id: str, query_hash: str) -> Optional[List[dict]]:
        """
        Retrieve cached full results by hash (for hit validation).
        
        Args:
            user_id: User ID.
            query_hash: Short SHA256 hash of query.
        
        Returns:
            Optional[List[dict]]: Deserialized results or None if expired/missing.
        """
        try:
            doc = self.search_cache.find_one(
                {"user_id": user_id, "query_hash": query_hash},
                projection={"_id": 0, "expires_at": 0}
            )
            return doc["results"] if doc else None
        except PyMongoError as e:
            logger.error(f"Failed to get cache for user {user_id}: {e}")
            return None


cache_service = CacheService()