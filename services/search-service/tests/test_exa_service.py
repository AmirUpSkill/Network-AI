"""
Test suite for the Exa Service.
Includes smoke tests, unit tests, and integration tests for LinkedIn search functionality.
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
from app.services.exa_service import ExaService, exa_service
from app.models.search import PersonResult
from app.core.config import settings
from typing import Dict, List, Any


class TestExaServiceSmoke:
    """Smoke tests for basic Exa service functionality."""

    def test_exa_service_import(self):
        """Test that ExaService can be imported successfully."""
        from app.services.exa_service import ExaService
        assert ExaService is not None

    def test_exa_service_instantiation_with_api_key(self):
        """Test that ExaService can be instantiated with API key."""
        # This should work since we have EXA_API_KEY in .env
        service = ExaService()
        assert service is not None
        assert hasattr(service, 'client')
        assert hasattr(service, 'search_linkedin')
        assert hasattr(service, 'parse_to_person_results')

    def test_global_service_instance(self):
        """Test that the global exa_service instance exists."""
        from app.services.exa_service import exa_service
        assert exa_service is not None
        assert isinstance(exa_service, ExaService)

    def test_service_methods_exist(self):
        """Test that all required methods exist on the service."""
        service = ExaService()
        assert callable(getattr(service, 'search_linkedin', None))
        assert callable(getattr(service, 'parse_to_person_results', None))


class TestExaServiceInitialization:
    """Tests for ExaService initialization scenarios."""

    @patch('app.services.exa_service.settings')
    def test_init_without_api_key_raises_error(self, mock_settings):
        """Test that initialization fails when API key is missing."""
        mock_settings.exa_api_key = None
        
        with pytest.raises(ValueError, match="EXA_API_KEY is required"):
            ExaService()

    @patch('app.services.exa_service.settings')
    def test_init_with_empty_api_key_raises_error(self, mock_settings):
        """Test that initialization fails when API key is empty."""
        mock_settings.exa_api_key = ""
        
        with pytest.raises(ValueError, match="EXA_API_KEY is required"):
            ExaService()

    @patch('app.services.exa_service.settings')
    @patch('app.services.exa_service.Exa')
    def test_init_with_valid_api_key(self, mock_exa, mock_settings):
        """Test successful initialization with valid API key."""
        mock_settings.exa_api_key = "test_api_key"
        mock_client = Mock()
        mock_exa.return_value = mock_client

        service = ExaService()

        mock_exa.assert_called_once_with(api_key="test_api_key")
        assert service.client == mock_client


class TestExaServiceSearchLinkedIn:
    """Tests for the search_linkedin method."""

    @patch('app.services.exa_service.settings')
    @patch('app.services.exa_service.Exa')
    def test_search_linkedin_success(self, mock_exa, mock_settings):
        """Test successful LinkedIn search."""
        # Setup
        mock_settings.exa_api_key = "test_key"
        mock_client = Mock()
        mock_exa.return_value = mock_client
        
        # Mock the search result
        mock_result = Mock()
        mock_result.model_dump.return_value = {
            "results": [{"id": "test", "title": "Test Person"}],
            "searchTime": 1234.5
        }
        mock_client.search_and_contents.return_value = mock_result
        
        service = ExaService()
        
        # Act
        result = service.search_linkedin("software engineers", limit=5, category="linkedin profile")
        
        # Assert
        mock_client.search_and_contents.assert_called_once_with(
            query="software engineers",
            type="auto",
            category="linkedin profile",
            num_results=5,
            text=True
        )
        assert result == {"results": [{"id": "test", "title": "Test Person"}], "searchTime": 1234.5}

    @patch('app.services.exa_service.settings')
    @patch('app.services.exa_service.Exa')
    def test_search_linkedin_default_parameters(self, mock_exa, mock_settings):
        """Test LinkedIn search with default parameters."""
        mock_settings.exa_api_key = "test_key"
        mock_client = Mock()
        mock_exa.return_value = mock_client
        
        mock_result = Mock()
        mock_result.model_dump.return_value = {"results": []}
        mock_client.search_and_contents.return_value = mock_result
        
        service = ExaService()
        
        # Act with only required parameter
        service.search_linkedin("test query")
        
        # Assert default values were used
        mock_client.search_and_contents.assert_called_once_with(
            query="test query",
            type="auto",
            category="linkedin profile",
            num_results=10,
            text=True
        )

    @patch('app.services.exa_service.settings')
    @patch('app.services.exa_service.Exa')
    def test_search_linkedin_api_exception(self, mock_exa, mock_settings):
        """Test LinkedIn search when API raises exception."""
        mock_settings.exa_api_key = "test_key"
        mock_client = Mock()
        mock_exa.return_value = mock_client
        
        # Mock API exception
        mock_client.search_and_contents.side_effect = Exception("API Error")
        
        service = ExaService()
        
        # Act & Assert
        with patch('builtins.print') as mock_print:
            with pytest.raises(Exception, match="API Error"):
                service.search_linkedin("test query")
        
        mock_print.assert_called_once_with("Exa search failed: API Error")


class TestExaServiceParseResults:
    """Tests for the parse_to_person_results method."""

    def test_parse_empty_results(self):
        """Test parsing empty results list."""
        service = ExaService()
        result = service.parse_to_person_results([])
        assert result == []

    def test_parse_basic_person_result(self):
        """Test parsing a basic person result."""
        service = ExaService()
        
        raw_data = [{
            "id": "https://linkedin.com/in/testuser",
            "url": "https://linkedin.com/in/testuser",
            "title": "Software Engineer at Google",
            "author": "Test User",
            "text": "Test User [us]\n## About me\nSoftware engineer with 5 years experience\n## Work Experience\n- ### Software Engineer at Google\nMay 2020 - Present\nSan Francisco, CA",
            "image": "https://example.com/image.jpg"
        }]
        
        results = service.parse_to_person_results(raw_data)
        
        assert len(results) == 1
        person = results[0]
        assert isinstance(person, PersonResult)
        assert person.id == "https://linkedin.com/in/testuser"
        assert person.url == "https://linkedin.com/in/testuser"
        assert person.title == "Software Engineer at Google"
        assert person.author == "Test User"
        assert person.location == "[us]"
        assert "Software engineer with 5 years experience" in person.summary

    def test_parse_location_extraction(self):
        """Test location extraction with different patterns."""
        service = ExaService()
        
        test_cases = [
            ("Text with [us] location", "[us]"),
            ("Text with [se] location", "[se]"),
            ("Text with [other] location", "[other]"),
            ("Text without location", None)
        ]
        
        for text, expected_location in test_cases:
            raw_data = [{"text": text, "id": "test", "url": "test", "title": "test", "author": "test"}]
            results = service.parse_to_person_results(raw_data)
            assert results[0].location == expected_location

    def test_parse_work_experience(self):
        """Test work experience parsing."""
        service = ExaService()
        
        raw_data = [{
            "id": "test", "url": "test", "title": "test", "author": "test",
            "text": "- ### Senior Engineer at Google\nMay 2020 - Present\n- ### Junior Engineer at Facebook\nJan 2018 - Apr 2020"
        }]
        
        results = service.parse_to_person_results(raw_data)
        work_exp = results[0].work_experience
        
        assert len(work_exp) == 2
        assert work_exp[0]["title"] == "Senior Engineer"
        assert work_exp[0]["company"] == "Google"
        assert work_exp[0]["duration"] == "May 2020 - Present"
        assert work_exp[1]["title"] == "Junior Engineer"
        assert work_exp[1]["company"] == "Facebook"

    def test_parse_education(self):
        """Test education parsing."""
        service = ExaService()
        
        raw_data = [{
            "id": "test", "url": "test", "title": "test", "author": "test",
            "text": "## Education\n- Bachelor's degree || Computer Science at Stanford University\n- Master's degree || AI at MIT"
        }]
        
        results = service.parse_to_person_results(raw_data)
        education = results[0].education
        
        assert len(education) == 2
        assert education[0]["degree"] == "Bachelor's degree"
        assert education[0]["field_of_study"] == "Computer Science"
        assert education[0]["institution"] == "Stanford University"

    def test_parse_skills(self):
        """Test skills parsing."""
        service = ExaService()
        
        raw_data = [{
            "id": "test", "url": "test", "title": "test", "author": "test",
            "text": "skills: [Python, JavaScript, React, Node.js]"
        }]
        
        results = service.parse_to_person_results(raw_data)
        skills = results[0].skills
        
        assert len(skills) == 4
        assert "Python" in skills
        assert "JavaScript" in skills
        assert "React" in skills
        assert "Node.js" in skills

    def test_parse_summary_extraction(self):
        """Test summary extraction from About me section."""
        service = ExaService()
        
        raw_data = [{
            "id": "test", "url": "test", "title": "test", "author": "test",
            "text": "Some intro text\n## About me\nI am a passionate software engineer\n## Work Experience\nSome work info"
        }]
        
        results = service.parse_to_person_results(raw_data)
        summary = results[0].summary
        
        assert summary == "I am a passionate software engineer\n"

    def test_parse_missing_optional_fields(self):
        """Test parsing when optional fields are missing."""
        service = ExaService()
        
        raw_data = [{
            "id": "test",
            "url": "test", 
            "title": "test",
            "author": "test",
            "text": "Basic text without special sections"
        }]
        
        results = service.parse_to_person_results(raw_data)
        person = results[0]
        
        assert person.location is None
        assert person.summary is None
        assert person.work_experience == []
        assert person.education == []
        assert person.skills == []
        assert person.image == ""


@pytest.mark.integration
class TestExaServiceIntegration:
    """Integration tests that require actual API calls."""

    @pytest.mark.skipif(not settings.exa_api_key, reason="No Exa API key available")
    def test_real_linkedin_search(self):
        """Test actual LinkedIn search if API key is available."""
        service = ExaService()
        
        # Simple test query
        result = service.search_linkedin("software engineer", limit=3)
        
        # Basic assertions
        assert isinstance(result, dict)
        assert "results" in result
        assert len(result["results"]) <= 3

    @pytest.mark.skipif(not settings.exa_api_key, reason="No Exa API key available")
    def test_real_search_and_parse_integration(self):
        """Test full integration: search + parse."""
        service = ExaService()
        
        # Search
        raw_results = service.search_linkedin("startup founder", limit=2)
        
        # Parse
        if "results" in raw_results and raw_results["results"]:
            parsed = service.parse_to_person_results(raw_results["results"])
            
            assert isinstance(parsed, list)
            assert all(isinstance(p, PersonResult) for p in parsed)
            # Each result should have at least basic fields
            for person in parsed:
                assert person.id
                assert person.url


class TestExaServiceEdgeCases:
    """Tests for edge cases and boundary conditions."""

    def test_parse_malformed_work_experience(self):
        """Test parsing malformed work experience data."""
        service = ExaService()
        
        raw_data = [{
            "id": "test", "url": "test", "title": "test", "author": "test",
            "text": "- ### Malformed entry without at keyword\n- ### Another at incomplete"
        }]
        
        results = service.parse_to_person_results(raw_data)
        # Should not crash, might have empty or partial work experience
        assert isinstance(results[0].work_experience, list)

    def test_parse_malformed_education(self):
        """Test parsing malformed education data."""
        service = ExaService()
        
        raw_data = [{
            "id": "test", "url": "test", "title": "test", "author": "test",
            "text": "## Education\n- Invalid format without pipes"
        }]
        
        results = service.parse_to_person_results(raw_data)
        # Should not crash
        assert isinstance(results[0].education, list)

    def test_parse_special_characters(self):
        """Test parsing with special characters."""
        service = ExaService()
        
        raw_data = [{
            "id": "test", "url": "test", "title": "Test & Co. Engineer", "author": "José María",
            "text": "skills: [C++, .NET, @mentions, #hashtags]"
        }]
        
        results = service.parse_to_person_results(raw_data)
        person = results[0]
        
        assert person.title == "Test & Co. Engineer"
        assert person.author == "José María"
        assert "C++" in person.skills

    def test_parse_very_long_text(self):
        """Test parsing with very long text content."""
        service = ExaService()
        
        long_text = "## About me\n" + "Very long description. " * 1000 + "\n## Work Experience"
        raw_data = [{
            "id": "test", "url": "test", "title": "test", "author": "test",
            "text": long_text
        }]
        
        results = service.parse_to_person_results(raw_data)
        # Should not crash and should extract summary
        assert results[0].summary is not None
        assert len(results[0].summary) > 100


# --- Test Fixtures ---
@pytest.fixture
def mock_exa_service():
    """Fixture that provides a mocked ExaService."""
    with patch('app.services.exa_service.ExaService') as mock_service:
        mock_instance = Mock()
        mock_service.return_value = mock_instance
        yield mock_instance


@pytest.fixture
def exa_service_with_mock_client():
    """Fixture that provides an ExaService with a mocked Exa client."""
    with patch('app.services.exa_service.settings') as mock_settings, \
         patch('app.services.exa_service.Exa') as mock_exa:
        
        mock_settings.exa_api_key = "test_key"
        mock_client = Mock()
        mock_exa.return_value = mock_client
        
        service = ExaService()
        yield service, mock_client


@pytest.fixture
def sample_linkedin_data():
    """Fixture providing sample LinkedIn data for testing."""
    return {
        "results": [
            {
                "id": "https://linkedin.com/in/john-doe",
                "url": "https://linkedin.com/in/john-doe",
                "title": "Senior Software Engineer at Google",
                "author": "John Doe",
                "text": """# John Doe [LinkedIn URL](https://linkedin.com/in/john-doe)
Senior Software Engineer at Google
### United States [us]
#### 500+ connections

## About me
Passionate software engineer with 8+ years of experience in building scalable systems.

## Work Experience
- ### Senior Software Engineer at Google
May 2020 - Present • 4 years
Mountain View, California, United States

- ### Software Engineer at Facebook  
Jan 2018 - Apr 2020 • 2 years 4 months
Menlo Park, California, United States

## Education
- ### Master of Science || Computer Science at Stanford University
2016 - 2018

- ### Bachelor of Science || Software Engineering at UC Berkeley  
2012 - 2016

skills: [Python, Java, JavaScript, React, Node.js, AWS, Docker]""",
                "image": "https://media.licdn.com/dms/image/example.jpg"
            }
        ],
        "searchTime": 1250.5,
        "costDollars": {"total": 0.02}
    }