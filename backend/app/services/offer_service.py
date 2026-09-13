import datetime
from decimal import Decimal
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session

from app.models.offer import Offer
from app.models.product import Product
from app.schemas.offer import OfferCreate, OfferUpdate, OfferResponse
from app.services.audit_service import AuditService

class OfferService:
    @staticmethod
    def compute_status(offer: Offer, now: Optional[datetime.datetime] = None) -> str:
        if not offer.active:
            return "DISABLED"
        current_time = now or datetime.datetime.utcnow()
        if current_time < offer.starts_at:
            return "SCHEDULED"
        if current_time > offer.ends_at:
            return "EXPIRED"
        return "ACTIVE"

    @staticmethod
    def to_response(offer: Offer, now: Optional[datetime.datetime] = None) -> OfferResponse:
        status_val = OfferService.compute_status(offer, now)
        res = OfferResponse.model_validate(offer)
        res.status = status_val
        return res

    @staticmethod
    def create(db: Session, data: OfferCreate, user_id: Optional[int] = None) -> Offer:
        # 1. Validar datas
        if data.starts_at > data.ends_at:
            raise ValueError("A data de início da oferta não pode ser posterior à data de término.")

        # 2. Validar produto e preço
        product = db.query(Product).filter(Product.id == data.product_id).first()
        if not product:
            raise ValueError("Produto associado não encontrado.")

        if data.promo_price >= product.price:
            raise ValueError(f"O preço promocional (R$ {data.promo_price:.2f}) deve ser estritamente menor que o preço original do produto (R$ {product.price:.2f}).")

        # 3. Calcular percentual de desconto se não informado
        discount = data.discount_percent
        if discount is None:
            discount = int(round(((float(product.price) - float(data.promo_price)) / float(product.price)) * 100))

        # 4. Se já existir oferta prévia do produto, remove antes de criar a nova
        existing_offer = db.query(Offer).filter(Offer.product_id == data.product_id).first()
        if existing_offer:
            db.delete(existing_offer)
            db.commit()

        offer = Offer(
            product_id=data.product_id,
            promo_price=data.promo_price,
            discount_percent=discount,
            starts_at=data.starts_at,
            ends_at=data.ends_at,
            promotional_text=data.promotional_text,
            featured=data.featured,
            active=data.active
        )
        db.add(offer)

        # Atualizar promo_price no produto se a oferta estiver ativa
        now = datetime.datetime.utcnow()
        if OfferService.compute_status(offer, now) == "ACTIVE":
            product.promo_price = offer.promo_price
        else:
            product.promo_price = None

        db.commit()
        db.refresh(offer)

        AuditService.log_action(
            db=db,
            action="CREATE_OFFER",
            entity_type="Offer",
            entity_id=offer.id,
            user_id=user_id,
            metadata={"product_id": offer.product_id, "promo_price": str(offer.promo_price), "discount": discount}
        )
        return offer

    @staticmethod
    def update(db: Session, offer: Offer, data: OfferUpdate, user_id: Optional[int] = None) -> Offer:
        update_data = data.model_dump(exclude_unset=True)

        new_starts = update_data.get("starts_at", offer.starts_at)
        new_ends = update_data.get("ends_at", offer.ends_at)
        if new_starts > new_ends:
            raise ValueError("A data de início da oferta não pode ser posterior à data de término.")

        product = offer.product
        new_promo_price = update_data.get("promo_price", offer.promo_price)
        if new_promo_price >= product.price:
            raise ValueError(f"O preço promocional (R$ {new_promo_price:.2f}) deve ser menor que o preço original (R$ {product.price:.2f}).")

        if "promo_price" in update_data and "discount_percent" not in update_data:
            update_data["discount_percent"] = int(round(((float(product.price) - float(new_promo_price)) / float(product.price)) * 100))

        for field, value in update_data.items():
            setattr(offer, field, value)

        now = datetime.datetime.utcnow()
        if OfferService.compute_status(offer, now) == "ACTIVE":
            product.promo_price = offer.promo_price
        else:
            product.promo_price = None

        db.commit()
        db.refresh(offer)

        AuditService.log_action(
            db=db,
            action="UPDATE_OFFER",
            entity_type="Offer",
            entity_id=offer.id,
            user_id=user_id,
            metadata={"promo_price": str(offer.promo_price)}
        )
        return offer

    @staticmethod
    def get_list(
        db: Session,
        only_active: bool = True,
        page: int = 1,
        page_size: int = 20
    ) -> Tuple[List[Offer], int]:
        now = datetime.datetime.utcnow()
        query = db.query(Offer)
        if only_active:
            query = query.filter(
                Offer.active == True,
                Offer.starts_at <= now,
                Offer.ends_at >= now
            )

        total = query.count()
        offers = query.order_by(Offer.featured.desc(), Offer.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
        return offers, total

    @staticmethod
    def get_by_id(db: Session, offer_id: int) -> Optional[Offer]:
        return db.query(Offer).filter(Offer.id == offer_id).first()

    @staticmethod
    def delete(db: Session, offer: Offer, user_id: Optional[int] = None) -> None:
        offer_id = offer.id
        product = offer.product
        if product:
            product.promo_price = None

        db.delete(offer)
        db.commit()

        AuditService.log_action(
            db=db,
            action="DELETE_OFFER",
            entity_type="Offer",
            entity_id=offer_id,
            user_id=user_id
        )
