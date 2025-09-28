import uuid
from fastapi import UploadFile
from app.core.database import storage_client

async def upload_resume(file: UploadFile) -> str:
    """
    Upload a resume PDF to Supabase Storage.
    Returns a UUID-based file_id (no user_id for now).
    """
    file_id = str(uuid.uuid4())
    file_path = f"{file_id}.pdf"

    contents = await file.read()
    await file.seek(0)  

    bucket = storage_client.from_("resumes")
    response = bucket.upload(
        path=file_path,
        file=contents,
        file_options={"content-type": "application/pdf"}
    )

    if not response:
        raise Exception("Upload failed")

    return file_id


async def download_resume(file_id: str) -> bytes:
    """
    Download a resume PDF from Supabase Storage by file_id.
    Returns raw PDF bytes.
    """
    file_path = f"{file_id}.pdf"
    bucket = storage_client.from_("resumes")
    try:
        response = bucket.download(file_path)
        return response
    except Exception as e:
        raise FileNotFoundError(f"Resume with file_id {file_id} not found") from e