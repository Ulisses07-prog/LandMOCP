from datetime import datetime
from typing import Optional
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict

class OfferBase(BaseModel):
    promo_price: Decimal = Field(..., gt=0)
    discount_percent: Optional[int] = Field(None, ge=1, le=99)
    starts_at: datetime
    ends_at: datetime
    promotional_text: Optional[str] = None
    featured: bool = False
    active: bool = True

class OfferCreate(OfferBase):
    product_id: int

class OfferUpdate(BaseModel):
    promo_price: Optional[Decimal] = Field(None, gt=0)
    discount_percent: Optional[int] = Field(None, ge=1, le=99)
    starts_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None
    promotional_text: Optional[str] = None
    featured: Optional[bool] = None
    active: Optional[bool] = None

class OfferResponse(OfferBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    created_at: datetime
    updated_at: datetime
