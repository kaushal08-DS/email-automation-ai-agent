from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_env: str = "development"
    frontend_url: str = "http://localhost:3000"
    backend_url: str = "http://localhost:8000"
    database_url: str = "sqlite:///./email_agent.db"
    jwt_secret: str
    token_encryption_key: str
    google_client_id: str
    google_client_secret: str
    google_redirect_uri: str
    openrouter_api_key: str = ""
    openrouter_model: str = "openai/gpt-4o-mini"
    razorpay_key_id: str = ""
    razorpay_key_secret: str = ""
    razorpay_webhook_secret: str = ""
    cookie_secure: bool = False
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
