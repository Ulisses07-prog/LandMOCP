from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.schemas.common import ApiResponse, MetaResponse
from app.services.category_service import CategoryService

router = APIRouter(prefix="/categories", tags=["Categorias"])

@router.get("", response_model=ApiResponse[List[CategoryResponse]])
def list_categories(
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    categories = CategoryService.get_all(db, active_only=active_only)
    return ApiResponse(
        data=categories,
        meta=MetaResponse(total=len(categories))
    )

@router.get("/{slug}", response_model=ApiResponse[CategoryResponse])
def get_category_by_slug(
    slug: str,
    db: Session = Depends(get_db)
):
    category = CategoryService.get_by_slug(db, slug)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoria não encontrada."
        )
    return ApiResponse(data=category)

@router.post("", response_model=ApiResponse[CategoryResponse], status_code=status.HTTP_201_CREATED)
def create_category(
    data: CategoryCreate,
    db: Session = Depends(get_db)
):
    category = CategoryService.create(db, data)
    return ApiResponse(data=category)

@router.put("/{category_id}", response_model=ApiResponse[CategoryResponse])
def update_category(
    category_id: int,
    data: CategoryUpdate,
    db: Session = Depends(get_db)
):
    category = CategoryService.get_by_id(db, category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoria não encontrada."
        )
    updated = CategoryService.update(db, category, data)
    return ApiResponse(data=updated)

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    category = CategoryService.get_by_id(db, category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoria não encontrada."
        )
    CategoryService.delete(db, category)
    return None
