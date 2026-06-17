from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_host: str = "127.0.0.1"
    app_port: int = 8000
    environment: str = "development"
    debug: bool = True

    secret_key: str = "change-me-in-production"
    api_key: str = ""

    db_host: str = "localhost"
    db_port: int = 5432
    db_name: str = "postgres"
    db_user: str = "postgres"
    db_password: str = ""
    database_url: str = "postgresql://postgres:@localhost:5432/postgres"


settings = Settings()
