"""
Test suite for the Gemini Service.
Includes smoke tests, unit tests, and integration tests for query enhancement functionality.
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
from app.services.gemini_service import GeminiService, gemini_service
from app.core.config import settings


class TestGeminiServiceSmoke:
    """Smoke tests for basic Gemini service functionality."""

    def test_gemini_service_import(self):
        """Test that GeminiService can be imported successfully."""
        from app.services.gemini_service import GeminiService
        assert GeminiService is not None

    def test_gemini_service_instantiation(self):
        """Test that GeminiService can be instantiated."""
        service = GeminiService()
        assert service is not None
        assert hasattr(service, 'client')
        assert hasattr(service, 'enhance_query')

    def test_global_service_instance(self):
        """Test that the global gemini_service instance exists."""
        from app.services.gemini_service import gemini_service
        assert gemini_service is not None
        assert isinstance(gemini_service, GeminiService)


class TestGeminiServiceInitialization:
    """Tests for GeminiService initialization with different API key scenarios."""

    @patch('app.services.gemini_service.settings')
    @patch('app.services.gemini_service.genai.Client')
    def test_init_with_api_key(self, mock_client, mock_settings):
        """Test initialization when API key is available."""
        # Arrange
        mock_settings.gemini_api_key = "test_api_key"
        mock_client_instance = Mock()
        mock_client.return_value = mock_client_instance

        # Act
        service = GeminiService()

        # Assert
        mock_client.assert_called_once_with(api_key="test_api_key")
        assert service.client == mock_client_instance

    @patch('app.services.gemini_service.settings')
    def test_init_without_api_key(self, mock_settings):
        """Test initialization when API key is not available."""
        # Arrange
        mock_settings.gemini_api_key = None

        # Act
        service = GeminiService()

        # Assert
        assert service.client is None

    @patch('app.services.gemini_service.settings')
    def test_init_with_empty_api_key(self, mock_settings):
        """Test initialization when API key is empty string."""
        # Arrange
        mock_settings.gemini_api_key = ""

        # Act
        service = GeminiService()

        # Assert
        assert service.client is None


class TestGeminiServiceQueryEnhancement:
    """Tests for the query enhancement functionality."""

    def test_enhance_query_no_client(self):
        """Test query enhancement when client is None."""
        # Arrange
        service = GeminiService()
        service.client = None
        original_query = "find software engineers"

        # Act
        result = service.enhance_query(original_query, "linkedin profile", 10)

        # Assert
        assert result == original_query

    @patch('app.services.gemini_service.settings')
    @patch('app.services.gemini_service.genai.Client')
    def test_enhance_query_success(self, mock_client, mock_settings):
        """Test successful query enhancement."""
        # Arrange
        mock_settings.gemini_api_key = "test_key"
        mock_client_instance = Mock()
        mock_client.return_value = mock_client_instance
        
        # Mock the API response
        mock_response = Mock()
        mock_response.text = "  Enhanced LinkedIn query: software engineers in San Francisco  "
        mock_client_instance.models.generate_content.return_value = mock_response
        
        service = GeminiService()
        original_query = "find software engineers in SF"

        # Act
        result = service.enhance_query(original_query, "linkedin profile", 5)

        # Assert
        assert result == "Enhanced LinkedIn query: software engineers in San Francisco"
        mock_client_instance.models.generate_content.assert_called_once()
        
        # Check the call arguments
        call_args = mock_client_instance.models.generate_content.call_args
        assert call_args[1]['model'] == 'gemini-2.5-flash-lite'
        assert original_query in call_args[1]['contents']
        assert "linkedin profile" in call_args[1]['contents']
        assert "5" in call_args[1]['contents']

    @patch('app.services.gemini_service.settings')
    @patch('app.services.gemini_service.genai.Client')
    def test_enhance_query_empty_response(self, mock_client, mock_settings):
        """Test query enhancement when API returns empty response."""
        # Arrange
        mock_settings.gemini_api_key = "test_key"
        mock_client_instance = Mock()
        mock_client.return_value = mock_client_instance
        
        mock_response = Mock()
        mock_response.text = "   "  # Empty/whitespace response
        mock_client_instance.models.generate_content.return_value = mock_response
        
        service = GeminiService()
        original_query = "find engineers"

        # Act
        result = service.enhance_query(original_query, "linkedin profile", 10)

        # Assert
        assert result == original_query

    @patch('app.services.gemini_service.settings')
    @patch('app.services.gemini_service.genai.Client')
    def test_enhance_query_api_exception(self, mock_client, mock_settings):
        """Test query enhancement when API call raises exception."""
        # Arrange
        mock_settings.gemini_api_key = "test_key"
        mock_client_instance = Mock()
        mock_client.return_value = mock_client_instance
        
        # Mock API exception
        mock_client_instance.models.generate_content.side_effect = Exception("API Error")
        
        service = GeminiService()
        original_query = "find engineers"

        # Act
        with patch('builtins.print') as mock_print:
            result = service.enhance_query(original_query, "linkedin profile", 10)

        # Assert
        assert result == original_query
        mock_print.assert_called_once_with("Gemini enhancement failed: API Error")

    @patch('app.services.gemini_service.settings')
    @patch('app.services.gemini_service.genai.Client')
    def test_enhance_query_different_categories(self, mock_client, mock_settings):
        """Test query enhancement with different categories."""
        # Arrange
        mock_settings.gemini_api_key = "test_key"
        mock_client_instance = Mock()
        mock_client.return_value = mock_client_instance
        
        mock_response = Mock()
        mock_response.text = "Enhanced query"
        mock_client_instance.models.generate_content.return_value = mock_response
        
        service = GeminiService()
        
        categories = ["linkedin profile", "company", "job_offers"]
        
        # Act & Assert
        for category in categories:
            result = service.enhance_query("test query", category, 5)
            assert result == "Enhanced query"
            
            # Verify category was included in the prompt
            call_args = mock_client_instance.models.generate_content.call_args
            assert category in call_args[1]['contents']


@pytest.mark.integration
class TestGeminiServiceIntegration:
    """Integration tests that require actual API calls."""

    @pytest.mark.skipif(not settings.gemini_api_key, reason="No Gemini API key available")
    def test_real_api_call(self):
        """Test actual API call if API key is available."""
        # This test only runs if GEMINI_API_KEY is set
        service = GeminiService()
        
        # Simple test query
        original = "find 5 startup founders in San Francisco"
        enhanced = service.enhance_query(original, "linkedin profile", 5)
        
        # Basic assertions
        assert isinstance(enhanced, str)
        assert len(enhanced) > 0
        # Enhanced query should be different from original (in most cases)
        # But we'll allow it to be the same in case of API issues
        assert enhanced is not None

    @pytest.mark.skipif(not settings.gemini_api_key, reason="No Gemini API key available")
    def test_real_api_various_queries(self):
        """Test real API with various query types."""
        service = GeminiService()
        
        test_queries = [
            ("software engineers in NYC", "linkedin profile", 10),
            ("AI startups founded after 2020", "company", 5),
            ("machine learning jobs", "job_offers", 15)
        ]
        
        for query, category, limit in test_queries:
            enhanced = service.enhance_query(query, category, limit)
            assert isinstance(enhanced, str)
            assert len(enhanced) > 0


class TestGeminiServiceEdgeCases:
    """Tests for edge cases and boundary conditions."""

    @patch('app.services.gemini_service.settings')
    @patch('app.services.gemini_service.genai.Client')
    def test_very_long_query(self, mock_client, mock_settings):
        """Test with a very long query."""
        mock_settings.gemini_api_key = "test_key"
        mock_client_instance = Mock()
        mock_client.return_value = mock_client_instance
        
        mock_response = Mock()
        mock_response.text = "Enhanced long query"
        mock_client_instance.models.generate_content.return_value = mock_response
        
        service = GeminiService()
        long_query = "find " * 100 + "engineers"  # Very long query
        
        result = service.enhance_query(long_query, "linkedin profile", 10)
        assert result == "Enhanced long query"

    @patch('app.services.gemini_service.settings')
    @patch('app.services.gemini_service.genai.Client')
    def test_special_characters_in_query(self, mock_client, mock_settings):
        """Test with special characters in query."""
        mock_settings.gemini_api_key = "test_key"
        mock_client_instance = Mock()
        mock_client.return_value = mock_client_instance
        
        mock_response = Mock()
        mock_response.text = "Enhanced special query"
        mock_client_instance.models.generate_content.return_value = mock_response
        
        service = GeminiService()
        special_query = "find engineers with C++ & Python (2024) @Google"
        
        result = service.enhance_query(special_query, "linkedin profile", 10)
        assert result == "Enhanced special query"

    @patch('app.services.gemini_service.settings')
    @patch('app.services.gemini_service.genai.Client')
    def test_extreme_limits(self, mock_client, mock_settings):
        """Test with extreme limit values."""
        mock_settings.gemini_api_key = "test_key"
        mock_client_instance = Mock()
        mock_client.return_value = mock_client_instance
        
        mock_response = Mock()
        mock_response.text = "Enhanced query"
        mock_client_instance.models.generate_content.return_value = mock_response
        
        service = GeminiService()
        
        # Test with very high limit
        result = service.enhance_query("find engineers", "linkedin profile", 1000)
        assert result == "Enhanced query"
        
        # Test with minimum limit
        result = service.enhance_query("find engineers", "linkedin profile", 1)
        assert result == "Enhanced query"


# --- Test Fixtures ---
@pytest.fixture
def mock_gemini_service():
    """Fixture that provides a mocked GeminiService."""
    with patch('app.services.gemini_service.GeminiService') as mock_service:
        mock_instance = Mock()
        mock_service.return_value = mock_instance
        yield mock_instance


@pytest.fixture
def gemini_service_with_client():
    """Fixture that provides a GeminiService with a mocked client."""
    with patch('app.services.gemini_service.settings') as mock_settings, \
         patch('app.services.gemini_service.genai.Client') as mock_client:
        
        mock_settings.gemini_api_key = "test_key"
        mock_client_instance = Mock()
        mock_client.return_value = mock_client_instance
        
        service = GeminiService()
        yield service, mock_client_instance


@pytest.fixture
def gemini_service_without_client():
    """Fixture that provides a GeminiService without a client."""
    with patch('app.services.gemini_service.settings') as mock_settings:
        mock_settings.gemini_api_key = None
        service = GeminiService()
        yield service