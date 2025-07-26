# app/config/settings.py

from pydantic_settings import BaseSettings  # type: ignore # ✅ Correct import for Pydantic v2

class Settings(BaseSettings):
    OPENROUTER_API_KEY: str
    OPENROUTER_MODEL: str = "openai/gpt-3.5-turbo"

    class Config:
        env_file = ".env"

settings = Settings()
