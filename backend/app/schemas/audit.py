from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime

class AuditLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: Optional[int] = None
    action: str
    entity_type: str
    entity_id: Optional[int] = None
    metadata_json: Optional[Dict[str, Any]] = None
    created_at: datetime

class AuditLogListResponse(BaseModel):
    total: int
    items: list[AuditLogOut]
