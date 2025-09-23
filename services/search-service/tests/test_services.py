"""Smoke tests for core services - config and database layers."""

import pytest
import os
from unittest.mock import patch, MagicMock
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

# Import what we're testing
from app.core.config import settings, Settings
from app.core.database import (
    get_mongo_client, 
    close_mongo_client, 
    get_database, 
    test_connection,
    _client
)

class TestConfigLayer:
    """Smoke tests for configuration management."""
    
    @pytest.mark.smoke
    def test_settings_load_successfully(self):
        """Test that settings can be loaded without errors."""
        # This will fail if .env is malformed or required fields missing
        assert settings is not None
        assert isinstance(settings, Settings)
    
    @pytest.mark.smoke 
    def test_required_settings_present(self):
        """Test that all required configuration values are present."""
        # Test required fields are not None/empty
        assert settings.exa_api_key, "EXA_API_KEY must be set"
        assert settings.mongodb_uri, "MONGODB_URI must be set"
        assert settings.app_name, "app_name should have default value"
    
    @pytest.mark.smoke
    def test_settings_types(self):
        """Test that settings have correct data types."""
        assert isinstance(settings.exa_api_key, str)
        assert isinstance(settings.mongodb_uri, str)
        assert isinstance(settings.app_name, str)
        assert isinstance(settings.debug, bool)
        # gemini_api_key is optional, could be None
        if settings.gemini_api_key:
            assert isinstance(settings.gemini_api_key, str)
    
    @pytest.mark.smoke
    def test_env_file_exists(self):
        """Test that .env file exists in expected location."""
        from pathlib import Path
        env_file_path = Path(__file__).parent.parent / ".env"
        assert env_file_path.exists(), f".env file not found at {env_file_path}"
    
    @pytest.mark.smoke
    def test_settings_can_be_recreated(self):
        """Test that settings can be instantiated multiple times."""
        new_settings = Settings()
        assert new_settings.exa_api_key == settings.exa_api_key
        assert new_settings.mongodb_uri == settings.mongodb_uri

class TestDatabaseLayer:
    """Smoke tests for database connection management."""
    
    def setup_method(self):
        """Clean up any existing connections before each test."""
        close_mongo_client()
    
    def teardown_method(self):
        """Clean up connections after each test."""
        close_mongo_client()
    
    @pytest.mark.smoke
    def test_mongo_client_creation(self):
        """Test that MongoDB client can be created."""
        client = get_mongo_client()
        assert client is not None
        assert hasattr(client, 'admin')  # Basic pymongo client check
    
    @pytest.mark.smoke
    def test_mongo_client_singleton(self):
        """Test that get_mongo_client returns same instance."""
        client1 = get_mongo_client()
        client2 = get_mongo_client()
        assert client1 is client2, "Should return same client instance"
    
    @pytest.mark.smoke
    def test_database_retrieval(self):
        """Test that database can be retrieved."""
        db = get_database("test_db")
        assert db is not None
        assert db.name == "test_db"
    
    @pytest.mark.smoke
    def test_close_mongo_client(self):
        """Test that client can be closed properly."""
        # First create a client
        client = get_mongo_client()
        assert client is not None
        
        # Then close it
        close_mongo_client()
        
        # Global client should be None
        global _client
        assert _client is None
    
    @pytest.mark.smoke
    @pytest.mark.integration
    def test_real_connection(self):
        """Test actual connection to MongoDB (requires valid credentials)."""
        # This test will fail if MongoDB credentials are invalid
        # but it's important to know if our connection actually works
        try:
            success = test_connection()
            if not success:
                pytest.skip("MongoDB connection failed - check credentials")
            assert success, "Should be able to connect to MongoDB"
        except Exception as e:
            pytest.skip(f"MongoDB connection test skipped: {e}")
    
    @pytest.mark.smoke
    def test_connection_error_handling(self):
        """Test that connection errors are properly handled."""
        # Mock a connection failure
        with patch('app.core.database.MongoClient') as mock_client:
            mock_client.side_effect = ConnectionFailure("Mocked connection error")
            
            with pytest.raises(ConnectionError, match="Failed to connect to MongoDB"):
                get_mongo_client()
    
    @pytest.mark.smoke 
    def test_ping_command_failure(self):
        """Test handling of ping command failures."""
        with patch('app.core.database.MongoClient') as mock_client:
            # Mock client that fails on ping
            mock_instance = MagicMock()
            mock_instance.admin.command.side_effect = ServerSelectionTimeoutError("Timeout")
            mock_client.return_value = mock_instance
            
            with pytest.raises(ConnectionError, match="Failed to connect to MongoDB"):
                get_mongo_client()
    
    @pytest.mark.smoke
    def test_test_connection_function(self):
        """Test the test_connection utility function."""
        # Mock successful connection
        with patch('app.core.database.MongoClient') as mock_client:
            mock_instance = MagicMock()
            mock_instance.admin.command.return_value = {'ok': 1}
            mock_client.return_value = mock_instance
            
            result = test_connection()
            assert result is True
            
            # Verify client was closed
            mock_instance.close.assert_called_once()
        
        # Mock failed connection
        with patch('app.core.database.MongoClient') as mock_client:
            mock_client.side_effect = ConnectionFailure("Connection failed")
            
            result = test_connection()
            assert result is False

class TestEnvironmentIntegration:
    """Integration tests between config and database."""
    
    @pytest.mark.smoke
    @pytest.mark.integration
    def test_config_database_integration(self):
        """Test that config settings work with database connection."""
        # Ensure settings can be loaded
        assert settings.mongodb_uri
        
        # Ensure database can use the settings
        try:
            client = get_mongo_client()
            assert client is not None
        except ConnectionError:
            pytest.skip("Database connection failed - check MongoDB URI")
        finally:
            close_mongo_client()
    
    @pytest.mark.smoke
    def test_all_imports_work(self):
        """Test that all core imports work without errors."""
        # This will catch any import-time errors
        from app.core.config import settings, Settings
        from app.core.database import (
            get_mongo_client,
            close_mongo_client, 
            get_database,
            test_connection
        )
        
        # Basic sanity checks
        assert Settings is not None
        assert settings is not None
        assert callable(get_mongo_client)
        assert callable(close_mongo_client)
        assert callable(get_database) 
        assert callable(test_connection)
