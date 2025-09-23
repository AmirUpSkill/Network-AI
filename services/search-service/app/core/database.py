from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from app.core.config import settings
from typing import Optional
import logging

logger = logging.getLogger(__name__)

# --- Global Client ---
_client: Optional[MongoClient] = None

def get_mongo_client() -> MongoClient:
    """
    Get or create a MongoDB Client with connection validation.
    
    Returns:
        MongoClient: A connected MongoDB client
        
    Raises:
        ConnectionError: If connection to MongoDB fails
    """
    global _client
    if _client is None:
        try:
            # Create client with connection timeout
            _client = MongoClient(
                settings.mongodb_uri,
                serverSelectionTimeoutMS=5000,  # 5 second timeout
                connectTimeoutMS=5000,
                maxPoolSize=50,
                minPoolSize=5
            )
            
            # Test the connection by running a simple command
            _client.admin.command('ping')
            logger.info("Successfully connected to MongoDB")
            
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise ConnectionError(f"Failed to connect to MongoDB: {e}")
        except Exception as e:
            logger.error(f"Unexpected error connecting to MongoDB: {e}")
            raise ConnectionError(f"Unexpected error connecting to MongoDB: {e}")
    
    return _client

def get_database(database_name: str = "networkai_search"):
    """
    Get a specific database from the MongoDB client.
    
    Args:
        database_name (str): Name of the database to retrieve
        
    Returns:
        Database: MongoDB database instance
    """
    client = get_mongo_client()
    return client[database_name]

def close_mongo_client():
    """
    Close the MongoDB Client if it exists.
    """
    global _client
    if _client is not None:
        logger.info("Closing MongoDB connection")
        _client.close()
        _client = None

def test_connection() -> bool:
    """
    Test MongoDB connection without creating persistent client.
    
    Returns:
        bool: True if connection successful, False otherwise
    """
    try:
        client = MongoClient(
            settings.mongodb_uri,
            serverSelectionTimeoutMS=3000
        )
        client.admin.command('ping')
        client.close()
        return True
    except Exception as e:
        logger.error(f"Connection test failed: {e}")
        return False
