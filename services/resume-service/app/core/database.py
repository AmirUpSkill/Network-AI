from supabase import create_client
from app.core.config import settings

# --- Initialize client with service_role key  ---
supabase_client = create_client(
    supabase_url=settings.SUPABASE_URL,
    supabase_key=settings.SUPABASE_KEY
)
storage_client = supabase_client.storage