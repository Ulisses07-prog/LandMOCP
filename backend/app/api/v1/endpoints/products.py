from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductDetailResponse,
)
from app.schemas.common import ApiResponse, MetaResponse
from app.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["Produtos"])

@router.get("", response_model=ApiResponse[List[ProductResponse]])
def list_products(
    category_id: Optional[int] = None,
    status_filter: Optional[str] = Query("PUBLISHED", alias="status"),
    search: Optional[str] = None,
    featured_only: bool = False,
    order_by: str = "recent",
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    products, total = ProductService.get_list(
        db,
        category_id=category_id,
        status=status_filter,
        search=search,
        featured_only=featured_only,
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
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado."
        )
    return ApiResponse(data=product)

@router.post("", response_model=ApiResponse[ProductResponse], status_code=status.HTTP_201_CREATED)
def create_product(
    data: ProductCreate,
    db: Session = Depends(get_db)
):
    product = ProductService.create(db, data)
    return ApiResponse(data=product)

@router.put("/{product_id}", response_model=ApiResponse[ProductResponse])
def update_product(
    product_id: int,
    data: ProductUpdate,
    db: Session = Depends(get_db)
):
    product = ProductService.get_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado."
        )
    updated = ProductService.update(db, product, data)
    return ApiResponse(data=updated)

@router.post("/{product_id}/publish", response_model=ApiResponse[ProductResponse])
def publish_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = ProductService.get_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado."
        )
    published = ProductService.publish(db, product)
    return ApiResponse(data=published)

@router.post("/{product_id}/unpublish", response_model=ApiResponse[ProductResponse])
def unpublish_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = ProductService.get_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado."
        )
    unpublished = ProductService.unpublish(db, product)
    return ApiResponse(data=unpublished)

@router.post("/{product_id}/duplicate", response_model=ApiResponse[ProductResponse])
def duplicate_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = ProductService.get_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado."
        )
    duplicated = ProductService.duplicate(db, product)
    return ApiResponse(data=duplicated)
