import os
from app.integrations.storage.base import MediaStorage
from app.core.config import settings

class LocalMediaStorage(MediaStorage):
    def __init__(self, base_path: str = None):
        self.base_path = os.path.abspath(base_path or settings.MEDIA_LOCAL_PATH)
        os.makedirs(self.base_path, exist_ok=True)

    def upload(self, file_bytes: bytes, storage_key: str, mime_type: str = "image/webp") -> str:
        # Sanitizar storage_key para evitar path traversal
        clean_key = storage_key.lstrip("/\\")
        dest_path = os.path.abspath(os.path.join(self.base_path, clean_key))

        if not dest_path.startswith(self.base_path):
            raise ValueError("Tentativa de path traversal detectada.")

        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        with open(dest_path, "wb") as f:
            f.write(file_bytes)

        return self.get_url(clean_key)

    def delete(self, storage_key: str) -> bool:
        clean_key = storage_key.lstrip("/\\")
        dest_path = os.path.abspath(os.path.join(self.base_path, clean_key))
        if os.path.exists(dest_path):
            os.remove(dest_path)
            return True
        return False

    def get_url(self, storage_key: str) -> str:
        clean_key = storage_key.lstrip("/\\").replace("\\", "/")
        return f"/media/{clean_key}"

    def exists(self, storage_key: str) -> bool:
        clean_key = storage_key.lstrip("/\\")
        dest_path = os.path.abspath(os.path.join(self.base_path, clean_key))
        return os.path.exists(dest_path)
