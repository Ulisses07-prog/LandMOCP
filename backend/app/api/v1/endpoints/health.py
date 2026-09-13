from fastapi import APIRouter

router = APIRouter()

@router.get("/health", tags=["Status"])
def health_check():
    return {
        "status": "ok",
        "service": "arruda-catalogo-backend",
        "version": "1.0.0"
    }

@router.get("/ready", tags=["Status"])
def readiness_check():
    return {
        "status": "ready"
    }
