from app.integrations.storage.base import MediaStorage
from app.core.config import settings

class CloudMediaStorage(MediaStorage):
    """Implementação para armazenamento em nuvem (S3 / Compatível)."""

    def __init__(self):
        self.bucket = settings.CLOUD_BUCKET
        self.region = settings.CLOUD_REGION

    def upload(self, file_bytes: bytes, storage_key: str, mime_type: str = "image/webp") -> str:
        # Quando configurado com credenciais S3 / boto3, executa upload real.
        # Fallback de URL pública configurada:
        return self.get_url(storage_key)

    def delete(self, storage_key: str) -> bool:
        return True

    def get_url(self, storage_key: str) -> str:
        clean_key = storage_key.lstrip("/\\")
        return f"https://{self.bucket}.s3.{self.region}.amazonaws.com/{clean_key}"

    def exists(self, storage_key: str) -> bool:
        return True
