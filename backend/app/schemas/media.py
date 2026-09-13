from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class MediaResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    storage_key: str
    url: str
    filename: str
    file_size: int
    mime_type: str
    width: Optional[int] = None
    height: Optional[int] = None
    created_at: datetime

class MediaAssociateRequest(BaseModel):
    product_id: int
    alt_text: Optional[str] = None
    is_primary: bool = False
    sort_order: int = 0
