from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class StoreBase(BaseModel):
    name: str = Field(..., max_length=100)
    slug: str = Field(..., max_length=100)
    type: str = Field(default="Filial", description="Matriz ou Filial")
    city: str = Field(..., max_length=100)
    state: str = Field(default="PI", max_length=2)
    address: Optional[str] = None
    whatsapp_number: str = Field(..., max_length=20)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_active: bool = True
    sort_order: int = 0

class StoreCreate(StoreBase):
    pass

class StoreUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    slug: Optional[str] = Field(None, max_length=100)
    type: Optional[str] = None
    city: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=2)
    address: Optional[str] = None
    whatsapp_number: Optional[str] = Field(None, max_length=20)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None

class StoreResponse(StoreBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class StoreWithSalespeople(StoreResponse):
    salespeople: List["SalespersonResponse"] = []

class SalespersonBase(BaseModel):
    name: str = Field(..., max_length=100)
    whatsapp_number: str = Field(..., max_length=20)
    is_active: bool = True

class SalespersonCreate(SalespersonBase):
    store_id: int

class SalespersonUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    whatsapp_number: Optional[str] = Field(None, max_length=20)
    is_active: Optional[bool] = None

class SalespersonResponse(SalespersonBase):
    id: int
    store_id: int
    assignment_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Atualizar referências forward
StoreWithSalespeople.model_rebuild()
