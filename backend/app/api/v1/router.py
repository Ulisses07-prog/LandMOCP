from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    auth,
    categories,
    products,
    media,
    offers,
    campaigns,
    analytics,
    audit,
)

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(categories.router)
api_router.include_router(products.router)
api_router.include_router(media.router)
api_router.include_router(offers.router)
api_router.include_router(campaigns.router)
api_router.include_router(analytics.router)
api_router.include_router(audit.router, prefix="/admin/audit-logs", tags=["admin-audit"])
