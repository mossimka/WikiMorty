from pydantic import SecretStr
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    GEMINI_API_KEY: SecretStr

    class Config:
        env_file = ".env"

settings = Settings()
