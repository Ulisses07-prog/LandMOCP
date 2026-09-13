import os

try:
    from pydantic_settings import BaseSettings
    class Settings(BaseSettings):
        APP_NAME: str = "Arruda Móveis Eletro - Catálogo"
        APP_ENV: str = "development"
        SECRET_KEY: str = "default-secret-key-change-in-production"
        API_V1_STR: str = "/api/v1"
        DATABASE_URL: str = "sqlite:///./dev_database.db"
        MEDIA_STORAGE: str = "local"
        MEDIA_LOCAL_PATH: str = "./media/uploads"
        CLOUD_PROVIDER: str = "s3"
        CLOUD_BUCKET: str = "arruda-catalogo-media"
        CLOUD_ACCESS_KEY: str = ""
        CLOUD_SECRET_KEY: str = ""
        CLOUD_REGION: str = "us-east-1"
        WHATSAPP_NUMBER: str = "5581999999999"

        class Config:
            extra = "ignore"
except ImportError:
    from pydantic import BaseModel
    class Settings(BaseModel):
        APP_NAME: str = os.getenv("APP_NAME", "Arruda Móveis Eletro - Catálogo")
        APP_ENV: str = os.getenv("APP_ENV", "development")
        SECRET_KEY: str = os.getenv("SECRET_KEY", "default-secret-key-change-in-production")
        API_V1_STR: str = os.getenv("API_V1_STR", "/api/v1")
        DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./dev_database.db")
        MEDIA_STORAGE: str = os.getenv("MEDIA_STORAGE", "local")
        MEDIA_LOCAL_PATH: str = os.getenv("MEDIA_LOCAL_PATH", "./media/uploads")
        CLOUD_PROVIDER: str = os.getenv("CLOUD_PROVIDER", "s3")
        CLOUD_BUCKET: str = os.getenv("CLOUD_BUCKET", "arruda-catalogo-media")
        CLOUD_ACCESS_KEY: str = os.getenv("CLOUD_ACCESS_KEY", "")
        CLOUD_SECRET_KEY: str = os.getenv("CLOUD_SECRET_KEY", "")
        CLOUD_REGION: str = os.getenv("CLOUD_REGION", "us-east-1")
        WHATSAPP_NUMBER: str = os.getenv("WHATSAPP_NUMBER", "5581999999999")

settings = Settings()
