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

@router.get("/db-status", tags=["Status"])
def db_status():
    from app.core.database import db_url, SessionLocal
    from sqlalchemy import text
    import traceback
    try:
        db = SessionLocal()
        prod_count = db.execute(text("SELECT count(*) FROM products")).scalar()
        cat_count = db.execute(text("SELECT count(*) FROM categories")).scalar()
        db.close()
        return {
            "status": "connected",
            "db_url": db_url,
            "products_count": prod_count,
            "categories_count": cat_count
        }
    except Exception as e:
        return {
            "status": "error",
            "db_url": db_url,
            "error": str(e),
            "traceback": traceback.format_exc()
        }
