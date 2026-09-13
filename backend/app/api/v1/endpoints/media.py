from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import require_roles
from app.models.user import User
from app.schemas.media import MediaResponse, MediaAssociateRequest
from app.schemas.product import ProductImageResponse
from app.schemas.common import ApiResponse, MetaResponse
from app.services.media_service import MediaService

router = APIRouter(prefix="/media", tags=["Mídia e Imagens"])

@router.post("/upload", response_model=ApiResponse[List[MediaResponse]], status_code=status.HTTP_201_CREATED)
async def upload_media(
    files: List[UploadFile] = File(...),
    current_user: User = Depends(require_roles("admin", "gerente", "operador")),
    db: Session = Depends(get_db)
):
    saved_media: List[MediaResponse] = []
    errors: List[str] = []

    for file in files:
        contents = await file.read()
        try:
            media = MediaService.process_and_store_image(
                db=db,
                file_bytes=contents,
                original_filename=file.filename or "imagem.jpg",
                user_id=current_user.id
            )
            saved_media.append(MediaResponse.model_validate(media))
        except ValueError as err:
            errors.append(f"{file.filename}: {str(err)}")

    if not saved_media and errors:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="; ".join(errors))

    return ApiResponse(
        data=saved_media,
        meta=MetaResponse(total=len(saved_media))
    )

@router.get("", response_model=ApiResponse[List[MediaResponse]])
def list_media(
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    media_items, total = MediaService.get_list(db, search=search, page=page, page_size=page_size)
    total_pages = (total + page_size - 1) // page_size if total > 0 else 1
    return ApiResponse(
        data=media_items,
        meta=MetaResponse(total=total, page=page, page_size=page_size, total_pages=total_pages)
    )

@router.delete("/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_media(
    media_id: int,
    current_user: User = Depends(require_roles("admin", "gerente")),
    db: Session = Depends(get_db)
):
    media = MediaService.get_by_id(db, media_id)
    if not media:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Arquivo de mídia não encontrado.")

    try:
        MediaService.delete(db, media, user_id=current_user.id)
    except ValueError as err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(err))

    return None

@router.post("/{media_id}/associate", response_model=ApiResponse[ProductImageResponse], status_code=status.HTTP_201_CREATED)
def associate_media_to_product(
    media_id: int,
    data: MediaAssociateRequest,
    current_user: User = Depends(require_roles("admin", "gerente", "operador")),
    db: Session = Depends(get_db)
):
    media = MediaService.get_by_id(db, media_id)
    if not media:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Arquivo de mídia não encontrado.")

    product_image = MediaService.associate_to_product(
        db=db,
        media=media,
        product_id=data.product_id,
        alt_text=data.alt_text,
        is_primary=data.is_primary,
        sort_order=data.sort_order
    )
    return ApiResponse(data=ProductImageResponse.model_validate(product_image))
