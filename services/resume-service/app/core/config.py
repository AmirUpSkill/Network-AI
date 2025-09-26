from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    # ---  Supabase ---
    SUPABASE_URL: str = Field(..., env="SUPABASE_URL")
    SUPABASE_KEY: str = Field(..., env="SUPABASE_KEY")

    #  ---  External APIs --- 
    LANDING_AI_API_KEY: str = Field(..., env="LANDING_AI_API_KEY")
    GEMINI_API_KEY: str = Field(..., env="GEMINI_API_KEY")
    FIRE_CRAWL_API_KEY: str = Field(..., env="FIRE_CRAWL_API_KEY")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# ---  Singleton instance --- 
settings = Settings()