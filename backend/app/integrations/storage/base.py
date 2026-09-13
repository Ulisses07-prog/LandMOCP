from abc import ABC, abstractmethod

class MediaStorage(ABC):
    @abstractmethod
    def upload(self, file_bytes: bytes, storage_key: str, mime_type: str = "image/webp") -> str:
        """Salva o arquivo e retorna a URL acessível."""
        pass

    @abstractmethod
    def delete(self, storage_key: str) -> bool:
        """Remove o arquivo do armazenamento."""
        pass

    @abstractmethod
    def get_url(self, storage_key: str) -> str:
        """Retorna a URL pública do arquivo."""
        pass

    @abstractmethod
    def exists(self, storage_key: str) -> bool:
        """Verifica se o arquivo existe no armazenamento."""
        pass
