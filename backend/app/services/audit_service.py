from typing import Optional, Any, Dict
from sqlalchemy.orm import Session
from app.models.analytics import AuditLog

class AuditService:
    @staticmethod
    def log_action(
        db: Session,
        action: str,
        entity_type: str,
        entity_id: Optional[int] = None,
        user_id: Optional[int] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> AuditLog:
        log = AuditLog(
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            user_id=user_id,
            metadata_json=metadata,
        )
        db.add(log)
        db.commit()
        db.refresh(log)
        return log
