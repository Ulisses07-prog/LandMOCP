from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.product import ProductResponse

class CampaignBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    slug: Optional[str] = Field(None, max_length=150)
    description: Optional[str] = None
    banner_url: Optional[str] = None
    starts_at: datetime
    ends_at: datetime
    active: bool = True

class CampaignCreate(CampaignBase):
    product_ids: List[int] = []

class CampaignUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=150)
    slug: Optional[str] = None
    description: Optional[str] = None
    banner_url: Optional[str] = None
    starts_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None
    active: Optional[bool] = None
    product_ids: Optional[List[int]] = None

class CampaignResponse(CampaignBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    status: str = "ACTIVE"
    created_at: datetime
    updated_at: datetime
    products: List[ProductResponse] = []
