import os
from agentic_doc.parse import parse
from app.core.config import settings
from app.services.storage_service import download_resume

async def parse_resume_from_storage(file_id: str) -> str:
    """
    Fetch resume from Supabase Storage and parse it with Landing AI.
    Uses agentic_doc library which supports parsing PDF bytes directly.
    """
    # ---  Get PDF bytes from Supabase Storage ---- 
    pdf_bytes = await download_resume(file_id)
    
    #----   Set the API key as environment variable --- 
    original_key = os.environ.get('VISION_AGENT_API_KEY')
    os.environ['VISION_AGENT_API_KEY'] = settings.LANDING_AI_API_KEY
    
    try:
        # --- Parse PDF bytes directly ----
        results = parse(pdf_bytes)
        
        if results and len(results) > 0:
            # ---  Extract markdown content from first result ---
            markdown_content = results[0].markdown
            return markdown_content.strip() if markdown_content else ""
        else:
            return ""
            
    finally:
        if original_key is not None:
            os.environ['VISION_AGENT_API_KEY'] = original_key
        elif 'VISION_AGENT_API_KEY' in os.environ:
            del os.environ['VISION_AGENT_API_KEY']
