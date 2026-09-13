import io
import uuid
from typing import List, Optional, Tuple
from PIL import Image, ImageOps
from sqlalchemy.orm import Session

from app.models.media import Media
from app.models.product import ProductImage
from app.integrations.storage import get_media_storage
from app.services.audit_service import AuditService

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB
ALLOWED_FORMATS = {"JPEG", "JPG", "PNG", "WEBP"}

class MediaService:
    @staticmethod
    def process_and_store_image(
        db: Session,
        file_bytes: bytes,
        original_filename: str,
        user_id: Optional[int] = None
    ) -> Media:
        # 1. Validar tamanho máximo
        if len(file_bytes) > MAX_FILE_SIZE_BYTES:
            raise ValueError("O tamanho do arquivo excede o limite máximo permitido de 10MB.")

        # 2. Inspecionar e decodificar imagem com Pillow (não confia na extensão)
        try:
            image = Image.open(io.BytesIO(file_bytes))
            image_format = (image.format or "").upper()
            if image_format not in ALLOWED_FORMATS:
                raise ValueError(f"Formato de imagem não suportado: {image_format}. Use JPG, PNG ou WEBP.")
            # Corrige orientação EXIF
            image = ImageOps.exif_transpose(image)
        except Exception as e:
            if isinstance(e, ValueError):
                raise e
            raise ValueError("O arquivo fornecido não é uma imagem válida ou está corrompido.")

        # Converter para RGB se necessário
        if image.mode in ("RGBA", "LA") or (image.mode == "P" and "transparency" in image.info):
            # Preserva transparência para WebP
            converted_image = image.convert("RGBA")
        else:
            converted_image = image.convert("RGB")

        # 3. Redimensionar se maior que 1600px mantendo proporção
        max_dim = 1600
        if converted_image.width > max_dim or converted_image.height > max_dim:
            converted_image.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)

        # 4. Codificar para WebP
        webp_buffer = io.BytesIO()
        converted_image.save(webp_buffer, format="WEBP", quality=85, optimize=True)
        webp_bytes = webp_buffer.getvalue()

        # 5. Gerar Thumbnail 300x300
        thumb_image = converted_image.copy()
        thumb_image.thumbnail((300, 300), Image.Resampling.LANCZOS)
        thumb_buffer = io.BytesIO()
        thumb_image.save(thumb_buffer, format="WEBP", quality=80)
        thumb_bytes = thumb_buffer.getvalue()

        # 6. Gravar no MediaStorage
        file_uuid = uuid.uuid4().hex
        storage_key = f"uploads/{file_uuid}.webp"
        thumb_key = f"uploads/{file_uuid}_thumb.webp"

        storage = get_media_storage()
        public_url = storage.upload(webp_bytes, storage_key, mime_type="image/webp")
        storage.upload(thumb_bytes, thumb_key, mime_type="image/webp")

        # 7. Salvar registro na tabela media
        media_record = Media(
            storage_key=storage_key,
            url=public_url,
            filename=original_filename,
            file_size=len(webp_bytes),
            mime_type="image/webp",
            width=converted_image.width,
            height=converted_image.height
        )
        db.add(media_record)
        db.commit()
        db.refresh(media_record)

        AuditService.log_action(
            db=db,
            action="UPLOAD_MEDIA",
            entity_type="Media",
            entity_id=media_record.id,
            user_id=user_id,
            metadata={"filename": original_filename, "storage_key": storage_key}
        )

        return media_record

    @staticmethod
    def get_list(
        db: Session,
        search: Optional[str] = None,
        page: int = 1,
        page_size: int = 20
    ) -> Tuple[List[Media], int]:
        query = db.query(Media)
        if search:
            query = query.filter(Media.filename.ilike(f"%{search}%"))

        total = query.count()
        media_list = query.order_by(Media.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
        return media_list, total

    @staticmethod
    def get_by_id(db: Session, media_id: int) -> Optional[Media]:
        return db.query(Media).filter(Media.id == media_id).first()

    @staticmethod
    def associate_to_product(
        db: Session,
        media: Media,
        product_id: int,
        alt_text: Optional[str] = None,
        is_primary: bool = False,
        sort_order: int = 0
    ) -> ProductImage:
        if is_primary:
            db.query(ProductImage).filter(ProductImage.product_id == product_id).update({"is_primary": False})

        product_image = ProductImage(
            product_id=product_id,
            storage_key=media.storage_key,
            url=media.url,
            alt_text=alt_text or media.filename,
            sort_order=sort_order,
            is_primary=is_primary,
            width=media.width,
            height=media.height,
            file_size=media.file_size,
            mime_type=media.mime_type
        )
        db.add(product_image)
        db.commit()
        db.refresh(product_image)
        return product_image

    @staticmethod
    def delete(db: Session, media: Media, user_id: Optional[int] = None) -> None:
        # Verificar se está associada a algum produto
        usage_count = db.query(ProductImage).filter(ProductImage.storage_key == media.storage_key).count()
        if usage_count > 0:
            raise ValueError(f"Não é possível excluir a mídia pois ela está em uso por {usage_count} produto(s).")

        storage = get_media_storage()
        storage.delete(media.storage_key)

        # Remove thumbnail também se existir
        thumb_key = media.storage_key.replace(".webp", "_thumb.webp")
        storage.delete(thumb_key)

        media_id = media.id
        media_key = media.storage_key
        db.delete(media)
        db.commit()

        AuditService.log_action(
            db=db,
            action="DELETE_MEDIA",
            entity_type="Media",
            entity_id=media_id,
            user_id=user_id,
            metadata={"storage_key": media_key}
        )
