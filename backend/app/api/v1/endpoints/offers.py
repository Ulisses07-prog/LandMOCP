from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import require_roles
from app.models.user import User
from app.schemas.offer import OfferCreate, OfferUpdate, OfferResponse
from app.schemas.common import ApiResponse, MetaResponse
from app.services.offer_service import OfferService

router = APIRouter(prefix="/offers", tags=["Ofertas"])

@router.get("", response_model=ApiResponse[List[OfferResponse]])
def list_offers(
    only_active: bool = True,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    offers, total = OfferService.get_list(db, only_active=only_active, page=page, page_size=page_size)
    response_items = [OfferService.to_response(o) for o in offers]
    total_pages = (total + page_size - 1) // page_size if total > 0 else 1
    return ApiResponse(
        data=response_items,
        meta=MetaResponse(total=total, page=page, page_size=page_size, total_pages=total_pages)
    )

@router.get("/{offer_id}", response_model=ApiResponse[OfferResponse])
def get_offer(offer_id: int, db: Session = Depends(get_db)):
    offer = OfferService.get_by_id(db, offer_id)
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Oferta não encontrada.")
    return ApiResponse(data=OfferService.to_response(offer))

@router.post("", response_model=ApiResponse[OfferResponse], status_code=status.HTTP_201_CREATED)
def create_offer(
    data: OfferCreate,
    current_user: User = Depends(require_roles("admin", "gerente")),
    db: Session = Depends(get_db)
):
    try:
        offer = OfferService.create(db, data, user_id=current_user.id)
    except ValueError as err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(err))
    return ApiResponse(data=OfferService.to_response(offer))

@router.put("/{offer_id}", response_model=ApiResponse[OfferResponse])
def update_offer(
    offer_id: int,
    data: OfferUpdate,
    current_user: User = Depends(require_roles("admin", "gerente")),
    db: Session = Depends(get_db)
):
    offer = OfferService.get_by_id(db, offer_id)
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Oferta não encontrada.")
    try:
        updated = OfferService.update(db, offer, data, user_id=current_user.id)
    except ValueError as err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(err))
    return ApiResponse(data=OfferService.to_response(updated))

@router.delete("/{offer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_offer(
    offer_id: int,
    current_user: User = Depends(require_roles("admin", "gerente")),
    db: Session = Depends(get_db)
):
    offer = OfferService.get_by_id(db, offer_id)
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Oferta não encontrada.")
    OfferService.delete(db, offer, user_id=current_user.id)
    return None
