from datetime import datetime
from typing import Optional, List
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.category import CategoryResponse
from app.schemas.offer import OfferResponse

class ProductImageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    storage_key: str
    url: str
    alt_text: Optional[str] = None
    sort_order: int
    is_primary: bool
    width: Optional[int] = None
    height: Optional[int] = None

class ProductBase(BaseModel):
    category_id: int
    name: str = Field(..., min_length=2, max_length=200)
    slug: Optional[str] = Field(None, max_length=200)
    sku: Optional[str] = Field(None, max_length=50)
    brand: Optional[str] = None
    group_name: Optional[str] = None
    subgroup: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    price: Decimal = Field(..., ge=0)
    old_price: Optional[Decimal] = Field(None, ge=0)
    promo_price: Optional[Decimal] = Field(None, ge=0)
    payment_condition: Optional[str] = None
    dimensions: Optional[str] = None
    weight: Optional[str] = None
    material: Optional[str] = None
    color: Optional[str] = None
    availability: str = "Pronta Entrega"
    stock: Optional[int] = None
    is_featured: bool = False
    status: str = "DRAFT"

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    category_id: Optional[int] = None
    name: Optional[str] = Field(None, min_length=2, max_length=200)
    slug: Optional[str] = None
    sku: Optional[str] = None
    brand: Optional[str] = None
    group_name: Optional[str] = None
    subgroup: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, ge=0)
    old_price: Optional[Decimal] = Field(None, ge=0)
    promo_price: Optional[Decimal] = Field(None, ge=0)
    payment_condition: Optional[str] = None
    dimensions: Optional[str] = None
    weight: Optional[str] = None
    material: Optional[str] = None
    color: Optional[str] = None
    availability: Optional[str] = None
    stock: Optional[int] = None
    is_featured: Optional[bool] = None
    status: Optional[str] = None

class ProductResponse(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None
    images: List[ProductImageResponse] = []
    offer: Optional[OfferResponse] = None

class ProductDetailResponse(ProductResponse):
    category: Optional[CategoryResponse] = None
