import datetime
from typing import Optional, List, Dict
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.analytics import AnalyticsEvent
from app.models.product import Product
from app.models.offer import Offer
from app.schemas.analytics import AnalyticsEventCreate, DashboardStatsResponse, TopProductStat

class AnalyticsService:
    @staticmethod
    def record_event(db: Session, data: AnalyticsEventCreate) -> AnalyticsEvent:
        event = AnalyticsEvent(
            event_type=data.event_type.upper(),
            product_id=data.product_id,
            category_id=data.category_id,
            campaign_id=data.campaign_id,
            session_hash=data.session_hash,
            metadata_json=data.metadata_json,
        )
        db.add(event)
        db.commit()
        db.refresh(event)
        return event

    @staticmethod
    def get_dashboard_stats(db: Session, period_days: int = 7) -> DashboardStatsResponse:
        now = datetime.datetime.utcnow()
        start_date = now - datetime.timedelta(days=period_days)

        # 1. Contagens de catálogo
        published = db.query(Product).filter(Product.status == "PUBLISHED").count()
        drafts = db.query(Product).filter(Product.status == "DRAFT").count()
        active_offers = db.query(Offer).filter(
            Offer.active == True,
            Offer.starts_at <= now,
            Offer.ends_at >= now
        ).count()

        # 2. Métricas de tráfego e conversão no período
        period_events = db.query(AnalyticsEvent).filter(AnalyticsEvent.created_at >= start_date)

        total_views = period_events.filter(
            AnalyticsEvent.event_type.in_(["PAGE_VIEW", "PRODUCT_VIEW"])
        ).count()

        total_whatsapp_clicks = period_events.filter(
            AnalyticsEvent.event_type == "WHATSAPP_CLICK"
        ).count()

        # 3. Produtos mais acessados no período
        product_views_query = (
            db.query(
                AnalyticsEvent.product_id,
                func.count(AnalyticsEvent.id).label("views")
            )
            .filter(
                AnalyticsEvent.created_at >= start_date,
                AnalyticsEvent.product_id.isnot(None),
                AnalyticsEvent.event_type == "PRODUCT_VIEW"
            )
            .group_by(AnalyticsEvent.product_id)
            .order_by(func.count(AnalyticsEvent.id).desc())
            .limit(5)
            .all()
        )

        top_products: List[TopProductStat] = []
        for prod_id, views_count in product_views_query:
            prod = db.query(Product).filter(Product.id == prod_id).first()
            if prod:
                wa_clicks = (
                    db.query(AnalyticsEvent)
                    .filter(
                        AnalyticsEvent.created_at >= start_date,
                        AnalyticsEvent.product_id == prod_id,
                        AnalyticsEvent.event_type == "WHATSAPP_CLICK"
                    )
                    .count()
                )
                top_products.append(
                    TopProductStat(
                        product_id=prod.id,
                        name=prod.name,
                        views=views_count,
                        whatsapp_clicks=wa_clicks
                    )
                )

        return DashboardStatsResponse(
            published_products=published,
            draft_products=drafts,
            active_offers=active_offers,
            total_views=total_views,
            total_whatsapp_clicks=total_whatsapp_clicks,
            top_products=top_products,
            period_days=period_days
        )
