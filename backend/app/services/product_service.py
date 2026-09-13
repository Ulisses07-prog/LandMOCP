import datetime
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate
from app.core.utils import slugify

class ProductService:
    @staticmethod
    def get_list(
        db: Session,
        category_id: Optional[int] = None,
        status: Optional[str] = "PUBLISHED",
        search: Optional[str] = None,
        featured_only: bool = False,
        order_by: str = "recent",
        page: int = 1,
        page_size: int = 20
    ) -> Tuple[List[Product], int]:
        query = db.query(Product)

        if status:
            query = query.filter(Product.status == status)
        if category_id:
            query = query.filter(Product.category_id == category_id)
        if featured_only:
            query = query.filter(Product.is_featured == True)
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                (Product.name.ilike(search_filter)) |
                (Product.brand.ilike(search_filter)) |
                (Product.sku.ilike(search_filter))
            )

        # Ordenação
        if order_by == "price_asc":
            query = query.order_by(Product.price.asc())
        elif order_by == "price_desc":
            query = query.order_by(Product.price.desc())
        elif order_by == "name_asc":
            query = query.order_by(Product.name.asc())
        else:  # recent
            query = query.order_by(Product.created_at.desc())

        total = query.count()
        products = query.offset((page - 1) * page_size).limit(page_size).all()
        return products, total

    @staticmethod
    def get_by_id(db: Session, product_id: int) -> Optional[Product]:
        return db.query(Product).filter(Product.id == product_id).first()

    @staticmethod
    def get_by_slug(db: Session, slug: str) -> Optional[Product]:
        return db.query(Product).filter(Product.slug == slug).first()

    @staticmethod
    def create(db: Session, data: ProductCreate) -> Product:
        slug = data.slug or slugify(data.name)
        base_slug = slug
        count = 1
        while db.query(Product).filter(Product.slug == slug).first():
            slug = f"{base_slug}-{count}"
            count += 1

        product_dict = data.model_dump()
        product_dict["slug"] = slug

        if product_dict.get("status") == "PUBLISHED" and not product_dict.get("published_at"):
            product_dict["published_at"] = datetime.datetime.utcnow()

        product = Product(**product_dict)
        db.add(product)
        db.commit()
        db.refresh(product)
        return product

    @staticmethod
    def update(db: Session, product: Product, data: ProductUpdate) -> Product:
        update_data = data.model_dump(exclude_unset=True)
        if "name" in update_data and "slug" not in update_data:
            update_data["slug"] = slugify(update_data["name"])

        if update_data.get("status") == "PUBLISHED" and not product.published_at:
            update_data["published_at"] = datetime.datetime.utcnow()

        for field, value in update_data.items():
            setattr(product, field, value)

        db.commit()
        db.refresh(product)
        return product

    @staticmethod
    def publish(db: Session, product: Product) -> Product:
        product.status = "PUBLISHED"
        product.published_at = datetime.datetime.utcnow()
        db.commit()
        db.refresh(product)
        return product

    @staticmethod
    def unpublish(db: Session, product: Product) -> Product:
        product.status = "DRAFT"
        db.commit()
        db.refresh(product)
        return product

    @staticmethod
    def duplicate(db: Session, product: Product) -> Product:
        new_name = f"{product.name} (Cópia)"
        new_slug = slugify(new_name)
        base_slug = new_slug
        count = 1
        while db.query(Product).filter(Product.slug == new_slug).first():
            new_slug = f"{base_slug}-{count}"
            count += 1

        new_product = Product(
            category_id=product.category_id,
            name=new_name,
            slug=new_slug,
            sku=f"{product.sku}-copy" if product.sku else None,
            brand=product.brand,
            short_description=product.short_description,
            description=product.description,
            price=product.price,
            old_price=product.old_price,
            promo_price=product.promo_price,
            payment_condition=product.payment_condition,
            dimensions=product.dimensions,
            weight=product.weight,
            material=product.material,
            color=product.color,
            availability=product.availability,
            stock=product.stock,
            is_featured=False,
            status="DRAFT",
        )
        db.add(new_product)
        db.commit()
        db.refresh(new_product)
        return new_product
