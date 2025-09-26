import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from app.services.scrape_service import scrape_job_posting

@pytest.mark.asyncio
async def test_scrape_job_posting_success():
    mock_response_data = {
        "data": {
            "markdown": "# AI Engineer Role\nWe are hiring an AI engineer with Python and LLM experience."
        }
    }

    with patch("app.services.scrape_service.httpx.AsyncClient") as mock_client:
        # Create a mock response object
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = mock_response_data  # NOT AsyncMock!
        mock_response.raise_for_status.return_value = None
        
        # Create mock client instance
        mock_instance = AsyncMock()
        mock_instance.post.return_value = mock_response  # Return the mock response directly
        mock_client.return_value.__aenter__.return_value = mock_instance

        result = await scrape_job_posting("https://example.com/job")

    assert result == "# AI Engineer Role\nWe are hiring an AI engineer with Python and LLM experience."


@pytest.mark.asyncio
async def test_scrape_job_posting_empty_markdown():
    mock_response_data = {"data": {"markdown": ""}}

    with patch("app.services.scrape_service.httpx.AsyncClient") as mock_client:
        # Create a mock response object
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = mock_response_data  # NOT AsyncMock!
        mock_response.raise_for_status.return_value = None
        
        # Create mock client instance
        mock_instance = AsyncMock()
        mock_instance.post.return_value = mock_response  # Return the mock response directly
        mock_client.return_value.__aenter__.return_value = mock_instance

        result = await scrape_job_posting("https://example.com/job")

    assert result == ""
