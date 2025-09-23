from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import Optional
import os
from pathlib import Path

class Settings(BaseSettings):
    # --- External API Keys ---
    exa_api_key: str = Field(..., description="Exa AI API Key")
    gemini_api_key: Optional[str] = Field(None, description="Google Gemini API Key")

    # --- Database ---
    mongodb_uri: str = Field(..., description="MongoDB connection URI")

    # --- App Settings ---
    app_name: str = Field(default="Search Service", description="Application name")
    debug: bool = Field(default=False, description="Debug mode")
    
    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).parent.parent.parent / ".env"),
        env_file_encoding='utf-8',
        case_sensitive=False,
        extra='ignore'
    )

# Create settings instance
settings = Settings()
