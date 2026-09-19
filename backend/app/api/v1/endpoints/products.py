from typing import List, Optional
import io
import unicodedata
import re
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, Query, status, UploadFile, File
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import oauth2_scheme, get_current_user
from app.models.user import User
from app.models.category import Category
from app.models.product import Product
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductDetailResponse,
    ProductImageResponse,
)
from app.schemas.common import ApiResponse, MetaResponse
from app.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["Produtos"])

def get_optional_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Optional[User]:
    if not token:
        return None
    try:
        return get_current_user(db=db, token=token)
    except Exception:
        return None

@router.get("/subgroups", response_model=ApiResponse[List[dict]])
def list_subgroups(
    category_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    subgroups = ProductService.get_subgroups(db, category_id=category_id)
    return ApiResponse(data=subgroups)

@router.get("", response_model=ApiResponse[List[ProductResponse]])
def list_products(
    category_id: Optional[int] = None,
    subgroup: Optional[str] = None,
    status_filter: Optional[str] = Query("PUBLISHED", alias="status"),
    search: Optional[str] = None,
    featured_only: bool = False,
    in_stock_only: bool = False,
    availability: Optional[str] = None,
    order_by: str = "recent",
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    products, total = ProductService.get_list(
        db,
        category_id=category_id,
        subgroup=subgroup,
        status=status_filter,
        search=search,
        featured_only=featured_only,
        in_stock_only=in_stock_only,
        availability=availability,
        order_by=order_by,
        page=page,
        page_size=page_size
    )
    total_pages = (total + page_size - 1) // page_size if total > 0 else 1
    return ApiResponse(
        data=products,
        meta=MetaResponse(
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages
        )
    )

@router.get("/{slug}", response_model=ApiResponse[ProductDetailResponse])
def get_product_by_slug(
    slug: str,
    db: Session = Depends(get_db)
):
    product = ProductService.get_by_slug(db, slug)
    if not product or product.status == "ARCHIVED":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado."
        )
    return ApiResponse(data=product)

@router.post("", response_model=ApiResponse[ProductResponse], status_code=status.HTTP_201_CREATED)
def create_product(
    data: ProductCreate,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.id if current_user else None
    product = ProductService.create(db, data, user_id=user_id)
    return ApiResponse(data=product)

@router.put("/{product_id}", response_model=ApiResponse[ProductResponse])
def update_product(
    product_id: int,
    data: ProductUpdate,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    product = ProductService.get_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado."
        )
    user_id = current_user.id if current_user else None
    try:
        updated = ProductService.update(db, product, data, user_id=user_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return ApiResponse(data=updated)

@router.post("/{product_id}/publish", response_model=ApiResponse[ProductResponse])
def publish_product(
    product_id: int,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    product = ProductService.get_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado."
        )
    user_id = current_user.id if current_user else None
    try:
        published = ProductService.publish(db, product, user_id=user_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return ApiResponse(data=published)

@router.post("/{product_id}/unpublish", response_model=ApiResponse[ProductResponse])
def unpublish_product(
    product_id: int,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    product = ProductService.get_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado."
        )
    user_id = current_user.id if current_user else None
    unpublished = ProductService.unpublish(db, product, user_id=user_id)
    return ApiResponse(data=unpublished)

@router.post("/{product_id}/archive", response_model=ApiResponse[ProductResponse])
def archive_product(
    product_id: int,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    product = ProductService.get_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado."
        )
    user_id = current_user.id if current_user else None
    archived = ProductService.archive(db, product, user_id=user_id)
    return ApiResponse(data=archived)

@router.post("/{product_id}/duplicate", response_model=ApiResponse[ProductResponse])
def duplicate_product(
    product_id: int,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    product = ProductService.get_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado."
        )
    user_id = current_user.id if current_user else None
    duplicated = ProductService.duplicate(db, product, user_id=user_id)
    return ApiResponse(data=duplicated)

@router.post("/sync-excel", response_model=ApiResponse[dict])
async def sync_products_excel(
    file: UploadFile = File(...),
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Sincroniza o catálogo a partir de uma planilha Excel (.xlsx).
    Cadastra novos itens e atualiza preços/estoques existentes.
    Define Pronta Entrega para estoque > 0 e Sob Encomenda para estoque == 0.
    """
    if not file.filename.endswith((".xlsx", ".xls")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O arquivo deve ser uma planilha Excel (.xlsx ou .xls)."
        )

    content = await file.read()
    df = pd.read_excel(io.BytesIO(content))

    if "Ativo" in df.columns:
        df = df[df["Ativo"].astype(str).str.lower().str.strip() == "sim"]

    def _slugify(text: str) -> str:
        s = unicodedata.normalize("NFKD", str(text)).encode("ascii", "ignore").decode("ascii")
        s = re.sub(r"[^a-zA-Z0-9]+", "-", s.strip().lower()).strip("-")
        return s or "item"

    def _clean(val):
        if pd.isna(val) or val is None:
            return None
        s = str(val).strip()
        return s if s else None

    categories_cache = {}
    existing_products = {p.sku: p for p in db.query(Product).all() if p.sku}
    created_count = 0
    updated_count = 0
    pronta_entrega = 0
    sob_encomenda = 0

    for idx, row in df.iterrows():
        raw_code = row.get("Código")
        if pd.isna(raw_code):
            continue
        code = str(int(raw_code) if isinstance(raw_code, (int, float)) else raw_code).strip()
        if not code or code == "nan":
            continue

        dept = _clean(row.get("Departamento")) or "Móveis"
        dept_name = dept.title()
        dept_slug = _slugify(dept_name)
        if dept_slug not in categories_cache:
            cat = db.query(Category).filter(Category.slug == dept_slug).first()
            if not cat:
                cat = Category(name=dept_name, slug=dept_slug, active=True)
                db.add(cat)
                db.commit()
                db.refresh(cat)
            categories_cache[dept_slug] = cat
        cat = categories_cache[dept_slug]

        name = _clean(row.get("Descrição")) or f"Produto {code}"
        try:
            price = float(row.get("Preço Padrão (R$)", 0.0) or 0.0)
        except Exception:
            price = 0.0

        try:
            stock = int(row.get("Estoque", 0) or 0)
        except Exception:
            stock = 0

        availability = "Pronta Entrega" if stock > 0 else "Sob Encomenda"
        if stock > 0:
            pronta_entrega += 1
        else:
            sob_encomenda += 1

        brand = _clean(row.get("Marca"))
        color = _clean(row.get("Cor"))
        alt = _clean(row.get("Altura"))
        lar = _clean(row.get("Largura"))
        prof = _clean(row.get("Profundidade"))
        dims = f"{alt} x {lar} x {prof} cm" if (alt and lar and prof) else None
        weight = _clean(row.get("Peso Líquido")) or _clean(row.get("Peso Bruto"))
        short_desc = _clean(row.get("TAG e-commerce")) or _clean(row.get("Grupo"))
        description = _clean(row.get("Descrição e-commerce")) or _clean(row.get("Descrição Complementar"))

        prod = existing_products.get(code)
        if not prod:
            slug_base = f"{_slugify(name)}-{code}"[:190]
            prod = Product(
                sku=code,
                slug=slug_base,
                category_id=cat.id,
                name=name[:200],
                brand=brand[:100] if brand else None,
                short_description=short_desc[:500] if short_desc else None,
                description=description,
                price=price,
                dimensions=dims[:100] if dims else None,
                weight=f"{weight} kg" if weight else None,
                color=color[:100] if color else None,
                stock=stock,
                availability=availability,
                status="PUBLISHED",
            )
            db.add(prod)
            existing_products[code] = prod
            created_count += 1
        else:
            prod.price = price
            prod.stock = stock
            prod.availability = availability
            prod.status = "PUBLISHED"
            if brand:
                prod.brand = brand[:100]
            if color:
                prod.color = color[:100]
            if dims:
                prod.dimensions = dims[:100]
            if description:
                prod.description = description
            updated_count += 1

        if (created_count + updated_count) % 500 == 0:
            db.commit()

    db.commit()

    return ApiResponse(
        data={
            "created": created_count,
            "updated": updated_count,
            "in_stock_count": pronta_entrega,
            "preorder_count": sob_encomenda,
            "total_processed": created_count + updated_count,
            "message": "Catálogo sincronizado com sucesso a partir do arquivo Excel."
        }
    )

