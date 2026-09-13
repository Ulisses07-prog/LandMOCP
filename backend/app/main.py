import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title=settings.APP_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Raiz health check
@app.get("/health", tags=["Status"])
def root_health():
    return {"status": "ok", "service": "arruda-catalogo-backend", "version": "1.0.0"}

@app.get("/ready", tags=["Status"])
def root_ready():
    return {"status": "ready"}

# Roteamento da API v1
app.include_router(api_router, prefix=settings.API_V1_STR)

# Servir uploads locais de mídia se configurado
media_dir = os.path.abspath(settings.MEDIA_LOCAL_PATH)
if not os.path.exists(media_dir):
    os.makedirs(media_dir, exist_ok=True)

app.mount("/media", StaticFiles(directory=media_dir), name="media")
