# File: services/search-service/tests/test_services.py

import pytest
from unittest.mock import MagicMock
from app.services.exa_service import ExaService
from app.models.search import SearchResponse

# A simple helper class to mimic the structure of Exa's 'Result' object.
# This makes our mock data more realistic and easier to work with.
class MockExaResult:
    def __init__(self, id, url, title, author, text, image=None):
        self.id = id
        self.url = url
        self.title = title
        self.author = author
        self.text = text
        self.image = image

# This pytest fixture provides consistent, fake data to any test that needs it.
# It simulates the response we would get from a real Exa API call.
@pytest.fixture
def mock_exa_api_response():
    """Provides a mock response object that simulates the Exa SDK's output."""
    mock_response = MagicMock()
    mock_response.results = [
        MockExaResult(
            id="https://www.linkedin.com/in/sounhochung",
            url="https://www.linkedin.com/in/sounhochung",
            title="Andrew Chung - Co-Founder & CEO @ Weavel (YC S24)",
            author="Andrew Chung",
            text="""
            # Andrew Chung [LinkedIn URL](https://www.linkedin.com/in/sounhochung)
            Co-Founder & CEO @ Weavel (YC S24) | Building the first AI prompt engineer
            ### Co-Founder at [Weavel](https://www.linkedin.com/company/weavel)
            Jan 2024 - Present • 1 year 1 month
            San Francisco, California, United States
            ## About me
            Building the first AI prompt engineer to automate the tedious parts of my job.
            ## Education
            - ### Bachelor's degree || Electrical and Computer Engineering at [Seoul National University]
            2020 - Present
            """,
            image="https://media.licdn.com/dms/image/v2/D5603AQExp149r_DU4w/profile-displayphoto-shrink_200_200/0/1719008367190"
        )
    ]
    return mock_response


# --- SMOKE TESTS ---

@pytest.mark.smoke
def test_search_linkedin_happy_path(monkeypatch, mock_exa_api_response):
    """
    Use Case 1: Test the basic, successful search flow.
    Ensures that a valid query returns a correctly parsed SearchResponse.
    """
    # Arrange: Mock the Exa client's 'search_and_contents' method to return our fake data
    # instead of making a real network call.
    mock_search = MagicMock(return_value=mock_exa_api_response)
    monkeypatch.setattr('exa_py.Exa.search_and_contents', mock_search)
    
    exa_service = ExaService()

    # Act: Call the service method we are testing
    response = exa_service.search_linkedin(query="find AI engineers")

    # Assert: Check if the response is correctly structured and if the parser worked
    assert response is not None
    assert isinstance(response, SearchResponse)
    assert len(response.results) == 1
    assert response.results[0].author == "Andrew Chung"
    assert response.results[0].work_experience[0].title == "Co-Founder"
    assert response.results[0].education[0].institution == "Seoul National University"
    assert response.metadata.total_results == 1

@pytest.mark.smoke
def test_search_with_gemini_enhancement(monkeypatch, mock_exa_api_response):
    """
    Use Case 2: Test that the 'enhanced_query' from Gemini is correctly passed to the metadata.
    """
    # Arrange
    mock_search = MagicMock(return_value=mock_exa_api_response)
    monkeypatch.setattr('exa_py.Exa.search_and_contents', mock_search)
    
    exa_service = ExaService()
    enhanced_q = "LinkedIn profiles for AI engineers with Python skills in SF"

    # Act
    response = exa_service.search_linkedin(
        query="find AI engineers",
        enhanced_query=enhanced_q
    )

    # Assert: The key is to verify the metadata contains the enhanced query.
    assert response.metadata.enhanced_query == enhanced_q

@pytest.mark.smoke
def test_search_with_no_results(monkeypatch):
    """
    Use Case 3: Test how the service handles an empty response from Exa.
    It should return an empty list and not crash.
    """
    # Arrange: Create a mock response with an empty 'results' list
    mock_empty_response = MagicMock()
    mock_empty_response.results = []
    mock_search = MagicMock(return_value=mock_empty_response)
    monkeypatch.setattr('exa_py.Exa.search_and_contents', mock_search)
    
    exa_service = ExaService()

    # Act
    response = exa_service.search_linkedin(query="nonexistent query string")

    # Assert: The response should be valid but empty.
    assert len(response.results) == 0
    assert response.metadata.total_results == 0

@pytest.mark.smoke
def test_search_passes_correct_parameters_to_exa(monkeypatch, mock_exa_api_response):
    """
    Use Case 4: Verify that parameters like 'limit' and 'category' are passed correctly to the Exa client.
    """
    # Arrange
    mock_search = MagicMock(return_value=mock_exa_api_response)
    monkeypatch.setattr('exa_py.Exa.search_and_contents', mock_search)
    
    exa_service = ExaService()

    # Act
    exa_service.search_linkedin(query="test", limit=5, category="company")

    # Assert: Check that the underlying mock was called with the exact arguments we expect.
    mock_search.assert_called_once_with(
        query="test",
        type="auto",
        category="company",
        num_results=5,
        text=True
    )

@pytest.mark.smoke
def test_search_handles_exa_api_error(monkeypatch):
    """
    Use Case 5: Test that if the Exa API fails (e.g., bad API key), our service raises an exception.
    This prevents the app from failing silently.
    """
    # Arrange: Configure the mock to raise an Exception when called.
    error_message = "Invalid API Key"
    mock_search = MagicMock(side_effect=Exception(error_message))
    monkeypatch.setattr('exa_py.Exa.search_and_contents', mock_search)
    
    exa_service = ExaService()

    # Act & Assert: Use pytest.raises to confirm that an exception is thrown.
    # The test passes only if the code inside the 'with' block raises the expected error.
    with pytest.raises(Exception, match=error_message):
        exa_service.search_linkedin(query="a query that will fail")