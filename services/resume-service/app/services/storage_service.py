from supabase import create_client, Client
from app.core.config import settings
import uuid
import logging

logger = logging.getLogger(__name__)

def get_supabase_admin_client() -> Client:
    """Returns a Supabase client authenticated with the service_role key (bypasses RLS)."""
    return create_client(
        supabase_url=settings.SUPABASE_URL,
        supabase_key=settings.SUPABASE_KEY 
    )

async def upload_resume(file) -> str:
    supabase = get_supabase_admin_client()
    file_id = str(uuid.uuid4())
    file_path = f"{file_id}.pdf"  #

    contents = await file.read()

    try:
        response = supabase.storage.from_("resumes").upload(  
            path=file_path,
            file=contents,
            file_options={"content-type": "application/pdf"}
        )
        logger.info(f"✅ Upload successful: {file_path}")
        return file_id
    except Exception as e:
        logger.error(f"❌ Upload failed: {e}")
        raise

async def download_resume(file_id: str) -> bytes:
    """Downloads resume from Supabase Storage as bytes."""
    supabase = get_supabase_admin_client()
    file_path = f"{file_id}.pdf"  
    
    try:
        logger.info(f"🔍 Attempting download: {file_path}")
        response = supabase.storage.from_("resumes").download(file_path)
        if isinstance(response, bytes):
            logger.info(f"✅ Download successful: {file_path}")
            return response
        else:
            raise Exception("Download did not return bytes")
    except Exception as e:
        logger.error(f"❌ Failed to download resume {file_id}: {str(e)}")
        raise e