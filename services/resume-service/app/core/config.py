from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    # ---  Supabase ---
    SUPABASE_URL: str = Field(..., description="Supabase project URL")
    SUPABASE_KEY: str = Field(..., description="Supabase service role key")

    #  ---  External APIs --- 
    LANDING_AI_API_KEY: str = Field(..., description="Landing AI API key for PDF parsing")
    GEMINI_API_KEY: str = Field(..., description="Google Gemini API key for analysis")
    FIRE_CRAWL_API_KEY: str = Field(..., description="FireCrawl API key for URL scraping")

    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        case_sensitive=True
    )


# ---  Singleton instance --- 
settings = Settings()