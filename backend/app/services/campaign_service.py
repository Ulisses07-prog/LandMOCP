import datetime
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session

from app.models.campaign import Campaign
from app.models.product import Product
from app.schemas.campaign import CampaignCreate, CampaignUpdate, CampaignResponse
from app.core.utils import slugify
from app.services.audit_service import AuditService

class CampaignService:
    @staticmethod
    def compute_status(campaign: Campaign, now: Optional[datetime.datetime] = None) -> str:
        if not campaign.active:
            return "DISABLED"
        current_time = now or datetime.datetime.utcnow()
        if current_time < campaign.starts_at:
            return "SCHEDULED"
        if current_time > campaign.ends_at:
            return "EXPIRED"
        return "ACTIVE"

    @staticmethod
    def to_response(campaign: Campaign) -> CampaignResponse:
        status_val = CampaignService.compute_status(campaign)
        res = CampaignResponse.model_validate(campaign)
        res.status = status_val
        return res

    @staticmethod
    def create(db: Session, data: CampaignCreate, user_id: Optional[int] = None) -> Campaign:
        if data.starts_at > data.ends_at:
            raise ValueError("A data de início da campanha não pode ser posterior à data de término.")

        slug = data.slug or slugify(data.name)
        base_slug = slug
        count = 1
        while db.query(Campaign).filter(Campaign.slug == slug).first():
            slug = f"{base_slug}-{count}"
            count += 1

        campaign = Campaign(
            name=data.name,
            slug=slug,
            description=data.description,
            banner_url=data.banner_url,
            starts_at=data.starts_at,
            ends_at=data.ends_at,
            active=data.active
        )

        if data.product_ids:
            products = db.query(Product).filter(Product.id.in_(data.product_ids)).all()
            campaign.products = products

        db.add(campaign)
        db.commit()
        db.refresh(campaign)

        AuditService.log_action(
            db=db,
            action="CREATE_CAMPAIGN",
            entity_type="Campaign",
            entity_id=campaign.id,
            user_id=user_id,
            metadata={"name": campaign.name}
        )
        return campaign

    @staticmethod
    def update(db: Session, campaign: Campaign, data: CampaignUpdate, user_id: Optional[int] = None) -> Campaign:
        update_data = data.model_dump(exclude_unset=True)

        new_starts = update_data.get("starts_at", campaign.starts_at)
        new_ends = update_data.get("ends_at", campaign.ends_at)
        if new_starts > new_ends:
            raise ValueError("A data de início da campanha não pode ser posterior à data de término.")

        if "name" in update_data and "slug" not in update_data:
            update_data["slug"] = slugify(update_data["name"])

        if "product_ids" in update_data:
            product_ids = update_data.pop("product_ids")
            products = db.query(Product).filter(Product.id.in_(product_ids)).all()
            campaign.products = products

        for field, value in update_data.items():
            setattr(campaign, field, value)

        db.commit()
        db.refresh(campaign)

        AuditService.log_action(
            db=db,
            action="UPDATE_CAMPAIGN",
            entity_type="Campaign",
            entity_id=campaign.id,
            user_id=user_id
        )
        return campaign

    @staticmethod
    def get_list(
        db: Session,
        only_active: bool = True,
        page: int = 1,
        page_size: int = 20
    ) -> Tuple[List[Campaign], int]:
        now = datetime.datetime.utcnow()
        query = db.query(Campaign)
        if only_active:
            query = query.filter(
                Campaign.active == True,
                Campaign.starts_at <= now,
                Campaign.ends_at >= now
            )

        total = query.count()
        campaigns = query.order_by(Campaign.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
        return campaigns, total

    @staticmethod
    def get_by_slug(db: Session, slug: str) -> Optional[Campaign]:
        return db.query(Campaign).filter(Campaign.slug == slug).first()

    @staticmethod
    def get_by_id(db: Session, campaign_id: int) -> Optional[Campaign]:
        return db.query(Campaign).filter(Campaign.id == campaign_id).first()

    @staticmethod
    def delete(db: Session, campaign: Campaign, user_id: Optional[int] = None) -> None:
        campaign_id = campaign.id
        db.delete(campaign)
        db.commit()

        AuditService.log_action(
            db=db,
            action="DELETE_CAMPAIGN",
            entity_type="Campaign",
            entity_id=campaign_id,
            user_id=user_id
        )
