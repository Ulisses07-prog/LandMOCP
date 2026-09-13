from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.core.utils import slugify

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
    def create(db: Session, data: CategoryCreate) -> Category:
        slug = data.slug or slugify(data.name)
        # Garantir slug único
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
        return category

    @staticmethod
    def update(db: Session, category: Category, data: CategoryUpdate) -> Category:
        update_data = data.model_dump(exclude_unset=True)
        if "name" in update_data and "slug" not in update_data:
            update_data["slug"] = slugify(update_data["name"])

        for field, value in update_data.items():
            setattr(category, field, value)

        db.commit()
        db.refresh(category)
        return category

    @staticmethod
    def delete(db: Session, category: Category) -> None:
        db.delete(category)
        db.commit()
