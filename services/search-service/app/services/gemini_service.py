from google import genai 
from app.core.config import settings 
from typing import Optional 

class GeminiService:
    """
        Service class for interacting with the Gemini API.
        Handles query enhancement 
    """
    def __init__(self):
        if settings.gemini_api_key:
            self.client = genai.Client(api_key=settings.gemini_api_key)
        else:
            self.client = None 
    def enhance_query(self, original_query: str, category: str, limit: int) -> str:
        """
        Enhance the natural language query using Gemini.
        Adds context like category, limit, and LinkedIn-specific filters.
        
        Args:
            original_query: User's raw query.
            category: Search category (e.g., "linkedin profile").
            limit: Max results.
        
        Returns:
            Enhanced query string for Exa.
        """
        if not self.client:
            return original_query
        prompt = f"""
        Refine this search query for a LinkedIn networking tool:
        Original: {original_query}
        Category: {category} (focus on LinkedIn data like profiles, companies, jobs).
        Limit results to: {limit}
        
        Make it semantic, add relevant filters (e.g., location, founded date, stage), 
        and ensure it's optimized for neural search. Output only the refined query string.
        """
        try:
            # --- API Call ----
            response = self.client.models.generate_content(
                model = 'gemini-2.5-flash-lite' , # --- A Lightweight model ---
                contents = prompt
            )
            enhanced = response.text.strip() if response and response.text else ""
            return enhanced if enhanced else original_query
        except Exception as e:
            print(f"Gemini enhancement failed: {e}")
            return original_query
gemini_service = GeminiService()