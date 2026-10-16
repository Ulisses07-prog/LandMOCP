from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.store import Store as StoreModel
from app.models.salesperson import Salesperson as SalespersonModel
from app.schemas.store import StoreCreate, StoreUpdate, StoreResponse, StoreWithSalespeople, SalespersonCreate, SalespersonUpdate, SalespersonResponse
import math

router = APIRouter()

# ================= LOJAS =================

@router.get("/stores", response_model=List[StoreResponse])
async def get_stores(
    is_active: bool = True,
    db: Session = Depends(get_db)
):
    """Retorna lista de lojas"""
    query = db.query(StoreModel)
    if is_active:
        query = query.filter(StoreModel.is_active == True)
    return query.order_by(StoreModel.sort_order, StoreModel.name).all()


@router.get("/stores/nearest", response_model=StoreResponse)
async def get_nearest_store(
    latitude: float = Query(..., description="Latitude do cliente"),
    longitude: float = Query(..., description="Longitude do cliente"),
    db: Session = Depends(get_db)
):
    """
    Retorna a loja mais próxima baseada em coordenadas geográficas.
    Usa fórmula de Haversine para calcular distância.
    """
    stores = db.query(StoreModel).filter(
        StoreModel.is_active == True,
        StoreModel.latitude.isnot(None),
        StoreModel.longitude.isnot(None)
    ).all()
    
    if not stores:
        raise HTTPException(status_code=404, detail="Nenhuma loja com coordenadas disponível")
    
    def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calcula distância em km entre dois pontos usando fórmula de Haversine"""
        R = 6371  # Raio da Terra em km
        
        lat1_rad = math.radians(lat1)
        lat2_rad = math.radians(lat2)
        delta_lat = math.radians(lat2 - lat1)
        delta_lon = math.radians(lon2 - lon1)
        
        a = (math.sin(delta_lat / 2) ** 2 +
             math.cos(lat1_rad) * math.cos(lat2_rad) *
             math.sin(delta_lon / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        
        return R * c
    
    # Encontrar loja mais próxima
    nearest_store = min(
        stores,
        key=lambda s: haversine(latitude, longitude, s.latitude, s.longitude)
    )
    
    return nearest_store


@router.get("/stores/{store_id}", response_model=StoreWithSalespeople)
async def get_store(store_id: int, db: Session = Depends(get_db)):
    """Retorna detalhes de uma loja com seus vendedores"""
    store = db.query(StoreModel).filter(StoreModel.id == store_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Loja não encontrada")
    return store


@router.get("/stores/slug/{slug}", response_model=StoreWithSalespeople)
async def get_store_by_slug(slug: str, db: Session = Depends(get_db)):
    """Retorna loja pelo slug com vendedores"""
    store = db.query(StoreModel).filter(StoreModel.slug == slug).first()
    if not store:
        raise HTTPException(status_code=404, detail="Loja não encontrada")
    return store


@router.post("/stores", response_model=StoreResponse)
async def create_store(store: StoreCreate, db: Session = Depends(get_db)):
    """Cria nova loja"""
    # Verificar se slug já existe
    existing = db.query(StoreModel).filter(StoreModel.slug == store.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug já existe")
    
    db_store = StoreModel(**store.model_dump())
    db.add(db_store)
    db.commit()
    db.refresh(db_store)
    return db_store


@router.put("/stores/{store_id}", response_model=StoreResponse)
async def update_store(store_id: int, store: StoreUpdate, db: Session = Depends(get_db)):
    """Atualiza loja"""
    db_store = db.query(StoreModel).filter(StoreModel.id == store_id).first()
    if not db_store:
        raise HTTPException(status_code=404, detail="Loja não encontrada")
    
    for field, value in store.model_dump(exclude_unset=True).items():
        setattr(db_store, field, value)
    
    db.commit()
    db.refresh(db_store)
    return db_store


# ================= VENDEDORES =================

@router.get("/salespeople", response_model=List[SalespersonResponse])
async def get_salespeople(
    store_id: Optional[int] = None,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """Retorna lista de vendedores"""
    query = db.query(SalespersonModel)
    if store_id:
        query = query.filter(SalespersonModel.store_id == store_id)
    if active_only:
        query = query.filter(SalespersonModel.is_active == True)
    return query.all()


@router.get("/salespeople/{salesperson_id}", response_model=SalespersonResponse)
async def get_salesperson(salesperson_id: int, db: Session = Depends(get_db)):
    """Retorna detalhes de um vendedor"""
    salesperson = db.query(SalespersonModel).filter(SalespersonModel.id == salesperson_id).first()
    if not salesperson:
        raise HTTPException(status_code=404, detail="Vendedor não encontrado")
    return salesperson


@router.post("/salespeople", response_model=SalespersonResponse)
async def create_salesperson(salesperson: SalespersonCreate, db: Session = Depends(get_db)):
    """Cria novo vendedor"""
    # Verificar se loja existe
    store = db.query(StoreModel).filter(StoreModel.id == salesperson.store_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Loja não encontrada")
    
    # Verificar se WhatsApp já existe
    existing = db.query(SalespersonModel).filter(
        SalespersonModel.whatsapp_number == salesperson.whatsapp_number
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="WhatsApp já cadastrado")
    
    db_salesperson = SalespersonModel(**salesperson.model_dump())
    db.add(db_salesperson)
    db.commit()
    db.refresh(db_salesperson)
    return db_salesperson


@router.put("/salespeople/{salesperson_id}", response_model=SalespersonResponse)
async def update_salesperson(
    salesperson_id: int,
    salesperson: SalespersonUpdate,
    db: Session = Depends(get_db)
):
    """Atualiza vendedor"""
    db_salesperson = db.query(SalespersonModel).filter(SalespersonModel.id == salesperson_id).first()
    if not db_salesperson:
        raise HTTPException(status_code=404, detail="Vendedor não encontrado")
    
    for field, value in salesperson.model_dump(exclude_unset=True).items():
        setattr(db_salesperson, field, value)
    
    db.commit()
    db.refresh(db_salesperson)
    return db_salesperson


@router.get("/stores/{store_id}/next-salesperson", response_model=SalespersonResponse)
async def get_next_salesperson(store_id: int, db: Session = Depends(get_db)):
    """
    Retorna o próximo vendedor disponível usando round-robin.
    Incrementa o contador de assignments do vendedor selecionado.
    """
    # Buscar vendedores ativos da loja
    salespeople = db.query(SalespersonModel).filter(
        SalespersonModel.store_id == store_id,
        SalespersonModel.is_active == True
    ).all()
    
    if not salespeople:
        raise HTTPException(status_code=404, detail="Nenhum vendedor ativo nesta loja")
    
    # Selecionar vendedor com menor contador (round-robin)
    next_salesperson = min(salespeople, key=lambda s: s.assignment_count)
    
    # Incrementar contador
    next_salesperson.assignment_count += 1
    db.commit()
    db.refresh(next_salesperson)
    
    return next_salesperson
