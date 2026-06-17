from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_host: str = "127.0.0.1"
    app_port: int = 8001
    environment: str = "development"
    debug: bool = True

    secret_key: str = "change-me-in-production"
    api_key: str = ""


settings = Settings()
