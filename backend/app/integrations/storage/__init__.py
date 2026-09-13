from app.core.config import settings
from app.integrations.storage.base import MediaStorage
from app.integrations.storage.local import LocalMediaStorage
from app.integrations.storage.cloud import CloudMediaStorage

def get_media_storage() -> MediaStorage:
    if settings.MEDIA_STORAGE.lower() == "cloud":
        return CloudMediaStorage()
    return LocalMediaStorage()

__all__ = ["MediaStorage", "LocalMediaStorage", "CloudMediaStorage", "get_media_storage"]
