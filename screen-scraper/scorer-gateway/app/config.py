from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="../.env", extra="ignore")

    gateway_host: str = "127.0.0.1"
    gateway_port: int = 8003
    environment: str = "development"
    debug: bool = True
    scraper_api_base_url: str = (
        "https://new-scrapper-provider-dev.internal.production.gm.paytmmoney.com"
    )


settings = Settings()
