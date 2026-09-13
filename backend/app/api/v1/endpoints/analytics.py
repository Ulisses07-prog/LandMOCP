from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import require_roles
from app.models.user import User
from app.schemas.analytics import AnalyticsEventCreate, DashboardStatsResponse
from app.schemas.common import ApiResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics e Telemetria"])

@router.post("/events", status_code=status.HTTP_201_CREATED)
def track_event(data: AnalyticsEventCreate, db: Session = Depends(get_db)):
    AnalyticsService.record_event(db, data)
    return {"status": "ok"}

@router.get("/dashboard", response_model=ApiResponse[DashboardStatsResponse])
def get_dashboard(
    period_days: int = Query(7, ge=1, le=90),
    current_user: User = Depends(require_roles("admin", "gerente")),
    db: Session = Depends(get_db)
):
    stats = AnalyticsService.get_dashboard_stats(db, period_days=period_days)
    return ApiResponse(data=stats)
