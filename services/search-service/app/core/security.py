from typing import Optional

async def get_current_user() -> Optional[str]:
    """
    Stub dependency for user ID.
    For MVP: Always returns None (no auth).
    Later: Integrate Supabase JWT validation.
    """
    return None