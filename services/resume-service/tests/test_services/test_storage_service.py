import pytest
from fastapi import UploadFile
from io import BytesIO
from app.services.storage_service import upload_resume
from unittest.mock import patch



@pytest.mark.skip(reason="Requires real Supabase access")
async def test_upload_resume_integration():
    # Simulate a real PDF upload
    pdf_content = b"%PDF-1.4\n...minimal pdf content..."  # or load real PDF
    upload_file = UploadFile(
        filename="test.pdf",
        file=BytesIO(pdf_content),
        content_type="application/pdf"
    )
    user_id = "test-user-123"
    file_id = await upload_resume(upload_file, user_id)
    assert len(file_id) == 36 