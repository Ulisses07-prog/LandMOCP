from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict

class AnalyticsEventCreate(BaseModel):
    event_type: str  # PAGE_VIEW, PRODUCT_VIEW, CATEGORY_VIEW, SEARCH, OFFER_VIEW, WHATSAPP_CLICK, SHARE
    product_id: Optional[int] = None
    category_id: Optional[int] = None
    campaign_id: Optional[int] = None
    session_hash: Optional[str] = None
    metadata_json: Optional[Dict[str, Any]] = None

class TopProductStat(BaseModel):
    product_id: int
    name: str
    views: int
    whatsapp_clicks: int

class DashboardStatsResponse(BaseModel):
    published_products: int
    draft_products: int
    active_offers: int
    total_views: int
    total_whatsapp_clicks: int
    top_products: List[TopProductStat] = []
    period_days: int
