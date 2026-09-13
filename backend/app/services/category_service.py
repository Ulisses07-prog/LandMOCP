from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.core.utils import slugify
from app.services.audit_service import AuditService

class CategoryService:
    @staticmethod
    def get_all(db: Session, active_only: bool = True) -> List[Category]:
        query = db.query(Category)
        if active_only:
            query = query.filter(Category.active == True)
        return query.order_by(Category.sort_order.asc(), Category.name.asc()).all()

    @staticmethod
    def get_by_id(db: Session, category_id: int) -> Optional[Category]:
        return db.query(Category).filter(Category.id == category_id).first()

    @staticmethod
    def get_by_slug(db: Session, slug: str) -> Optional[Category]:
        return db.query(Category).filter(Category.slug == slug).first()

    @staticmethod
    def create(db: Session, data: CategoryCreate, user_id: Optional[int] = None) -> Category:
        slug = data.slug or slugify(data.name)
        base_slug = slug
        count = 1
        while db.query(Category).filter(Category.slug == slug).first():
            slug = f"{base_slug}-{count}"
            count += 1

        category = Category(
            name=data.name,
            slug=slug,
            description=data.description,
            image_url=data.image_url,
            sort_order=data.sort_order,
            active=data.active
        )
        db.add(category)
        db.commit()
        db.refresh(category)

        AuditService.log_action(
            db=db,
            action="CREATE",
            entity_type="Category",
            entity_id=category.id,
            user_id=user_id,
            metadata={"name": category.name}
        )
        return category

    @staticmethod
    def update(db: Session, category: Category, data: CategoryUpdate, user_id: Optional[int] = None) -> Category:
        update_data = data.model_dump(exclude_unset=True)
        if "name" in update_data and "slug" not in update_data:
            update_data["slug"] = slugify(update_data["name"])

        for field, value in update_data.items():
            setattr(category, field, value)

        db.commit()
        db.refresh(category)

        AuditService.log_action(
            db=db,
            action="UPDATE",
            entity_type="Category",
            entity_id=category.id,
            user_id=user_id,
            metadata={"name": category.name}
        )
        return category

    @staticmethod
    def delete(db: Session, category: Category, user_id: Optional[int] = None) -> None:
        if len(category.products) > 0:
            raise ValueError("CANNOT_DELETE_CATEGORY_WITH_PRODUCTS: Não é possível excluir uma categoria que possui produtos vinculados.")

        category_id = category.id
        category_name = category.name
        db.delete(category)
        db.commit()

        AuditService.log_action(
            db=db,
            action="DELETE",
            entity_type="Category",
            entity_id=category_id,
            user_id=user_id,
            metadata={"name": category_name}
        )
