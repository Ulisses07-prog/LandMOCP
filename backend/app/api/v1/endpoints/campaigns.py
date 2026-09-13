from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import require_roles
from app.models.user import User
from app.schemas.campaign import CampaignCreate, CampaignUpdate, CampaignResponse
from app.schemas.common import ApiResponse, MetaResponse
from app.services.campaign_service import CampaignService

router = APIRouter(prefix="/campaigns", tags=["Campanhas Promocionais"])

@router.get("", response_model=ApiResponse[List[CampaignResponse]])
def list_campaigns(
    only_active: bool = True,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    campaigns, total = CampaignService.get_list(db, only_active=only_active, page=page, page_size=page_size)
    response_items = [CampaignService.to_response(c) for c in campaigns]
    total_pages = (total + page_size - 1) // page_size if total > 0 else 1
    return ApiResponse(
        data=response_items,
        meta=MetaResponse(total=total, page=page, page_size=page_size, total_pages=total_pages)
    )

@router.get("/{slug}", response_model=ApiResponse[CampaignResponse])
def get_campaign_by_slug(slug: str, db: Session = Depends(get_db)):
    campaign = CampaignService.get_by_slug(db, slug)
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campanha não encontrada.")
    return ApiResponse(data=CampaignService.to_response(campaign))

@router.post("", response_model=ApiResponse[CampaignResponse], status_code=status.HTTP_201_CREATED)
def create_campaign(
    data: CampaignCreate,
    current_user: User = Depends(require_roles("admin", "gerente")),
    db: Session = Depends(get_db)
):
    try:
        campaign = CampaignService.create(db, data, user_id=current_user.id)
    except ValueError as err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(err))
    return ApiResponse(data=CampaignService.to_response(campaign))

@router.put("/{campaign_id}", response_model=ApiResponse[CampaignResponse])
def update_campaign(
    campaign_id: int,
    data: CampaignUpdate,
    current_user: User = Depends(require_roles("admin", "gerente")),
    db: Session = Depends(get_db)
):
    campaign = CampaignService.get_by_id(db, campaign_id)
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campanha não encontrada.")
    try:
        updated = CampaignService.update(db, campaign, data, user_id=current_user.id)
    except ValueError as err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(err))
    return ApiResponse(data=CampaignService.to_response(updated))

@router.delete("/{campaign_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_campaign(
    campaign_id: int,
    current_user: User = Depends(require_roles("admin", "gerente")),
    db: Session = Depends(get_db)
):
    campaign = CampaignService.get_by_id(db, campaign_id)
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campanha não encontrada.")
    CampaignService.delete(db, campaign, user_id=current_user.id)
    return None
