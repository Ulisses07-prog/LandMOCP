from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.core.deps import require_roles
from app.models.user import User
from app.models.analytics import AuditLog
from app.schemas.audit import AuditLogListResponse, AuditLogOut

router = APIRouter()

@router.get("", response_model=AuditLogListResponse)
def list_audit_logs(
    entity_type: Optional[str] = Query(None, description="Filtrar por tipo de entidade (ex: Product, Offer)"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin"))
):
    query = db.query(AuditLog)
    if entity_type:
        query = query.filter(AuditLog.entity_type == entity_type)
    
    total = query.count()
    logs = query.order_by(AuditLog.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    return AuditLogListResponse(total=total, items=logs)
