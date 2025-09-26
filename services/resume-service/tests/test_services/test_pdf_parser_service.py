import pytest
from unittest.mock import patch, MagicMock
from app.services.pdf_parser_service import parse_resume_pdf

# Load a real PDF for testing input (but don't call real API)
TEST_PDF_PATH = "ATTESTATION DE PRESENCE (1).pdf"

def test_parse_resume_pdf_success():
    # Arrange
    with open(TEST_PDF_PATH, "rb") as f:
        pdf_bytes = f.read()

    mock_result = MagicMock()
    mock_result.markdown = "# John Doe\nSoftware Engineer\n..."
    mock_parse_result = [mock_result]

    # Act
    with patch("app.services.pdf_parser_service.parse", return_value=mock_parse_result):
        extracted_text = parse_resume_pdf(pdf_bytes)

    # Assert
    assert extracted_text == "# John Doe\nSoftware Engineer\n..."
    assert isinstance(extracted_text, str)
    assert len(extracted_text) > 0


def test_parse_resume_pdf_empty_result():
    with open(TEST_PDF_PATH, "rb") as f:
        pdf_bytes = f.read()

    with patch("app.services.pdf_parser_service.parse", return_value=[]):
        extracted_text = parse_resume_pdf(pdf_bytes)

    assert extracted_text == ""