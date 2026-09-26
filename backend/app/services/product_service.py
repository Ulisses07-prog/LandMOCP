import datetime
from typing import List, Optional, Tuple, Any
from sqlalchemy.orm import Session
from app.models.product import Product, ProductImage
from app.schemas.product import ProductCreate, ProductUpdate
from app.core.utils import slugify
from app.services.audit_service import AuditService

class ProductService:
    @staticmethod
    def get_list(
        db: Session,
        category_id: Optional[int] = None,
        status: Optional[str] = "PUBLISHED",
        search: Optional[str] = None,
        featured_only: bool = False,
        order_by: str = "recent",
        in_stock_only: bool = False,
        availability: Optional[str] = None,
        subgroup: Optional[str] = None,
        page: int = 1,
        page_size: int = 20
    ) -> Tuple[List[Product], int]:
        query = db.query(Product)

        if status:
            query = query.filter(Product.status == status)
        if category_id:
            query = query.filter(Product.category_id == category_id)
        if subgroup:
            query = query.filter(Product.subgroup == subgroup)
        if featured_only:
            query = query.filter(Product.is_featured == True)
        if in_stock_only:
            query = query.filter(Product.stock > 0)
        if availability:
            query = query.filter(Product.availability == availability)
        if search:
            words = [w.strip() for w in search.strip().split() if w.strip()]
            for word in words:
                search_filter = f"%{word}%"
                query = query.filter(
                    (Product.name.ilike(search_filter)) |
                    (Product.brand.ilike(search_filter)) |
                    (Product.sku.ilike(search_filter)) |
                    (Product.subgroup.ilike(search_filter))
                )

        # Ordenação com priorização automática para itens em estoque
        from sqlalchemy import case
        stock_priority = case((Product.stock > 0, 1), else_=0).desc()

        if order_by == "price_asc":
            query = query.order_by(stock_priority, Product.price.asc())
        elif order_by == "price_desc":
            query = query.order_by(stock_priority, Product.price.desc())
        elif order_by == "name_asc":
            query = query.order_by(stock_priority, Product.name.asc())
        else:  # recent
            query = query.order_by(stock_priority, Product.created_at.desc())

        total = query.count()
        products = query.offset((page - 1) * page_size).limit(page_size).all()
        return products, total

    @staticmethod
    def get_subgroups(db: Session, category_id: Optional[int] = None) -> List[dict]:
        from sqlalchemy import func
        query = db.query(Product.subgroup, func.count(Product.id).label("total")).filter(
            Product.status == "PUBLISHED",
            Product.subgroup != None,
            Product.subgroup != ""
        )
        if category_id:
            query = query.filter(Product.category_id == category_id)
        results = query.group_by(Product.subgroup).order_by(func.count(Product.id).desc()).limit(50).all()
        return [{"name": r[0], "count": r[1]} for r in results]

    @staticmethod
    def get_by_id(db: Session, product_id: int) -> Optional[Product]:
        return db.query(Product).filter(Product.id == product_id).first()

    @staticmethod
    def get_by_slug(db: Session, slug: str) -> Optional[Product]:
        return db.query(Product).filter(Product.slug == slug).first()

    @staticmethod
    def create(db: Session, data: ProductCreate, user_id: Optional[int] = None) -> Product:
        slug = data.slug or slugify(data.name)
        base_slug = slug
        count = 1
        while db.query(Product).filter(Product.slug == slug).first():
            slug = f"{base_slug}-{count}"
            count += 1

        product_dict = data.model_dump()
        product_dict["slug"] = slug

        # Para publicação direta, deve ser validado posteriormente ou criado em draft
        product_status = product_dict.get("status", "DRAFT")
        if product_status == "PUBLISHED":
            # Força draft na criação inicial caso ainda não haja imagens
            product_dict["status"] = "DRAFT"

        product = Product(**product_dict)
        db.add(product)
        db.commit()
        db.refresh(product)

        AuditService.log_action(
            db=db,
            action="CREATE",
            entity_type="Product",
            entity_id=product.id,
            user_id=user_id,
            metadata={"name": product.name, "price": str(product.price)}
        )
        return product

    @staticmethod
    def update(db: Session, product: Product, data: ProductUpdate, user_id: Optional[int] = None) -> Product:
        update_data = data.model_dump(exclude_unset=True)
        old_price = str(product.price)

        if "name" in update_data and "slug" not in update_data:
            update_data["slug"] = slugify(update_data["name"])

        # Regra de publicação: se tentar mudar para PUBLISHED, valida foto principal
        if update_data.get("status") == "PUBLISHED":
            has_primary = any(img.is_primary for img in product.images)
            if not has_primary:
                raise ValueError("PUBLISH_NO_PRIMARY_IMAGE: É obrigatório possuir uma imagem principal para publicar o produto.")
            if not product.published_at:
                update_data["published_at"] = datetime.datetime.utcnow()

        for field, value in update_data.items():
            setattr(product, field, value)

        db.commit()
        db.refresh(product)

        metadata: dict[str, Any] = {"status": product.status}
        if "price" in update_data:
            metadata["price_changed"] = {"from": old_price, "to": str(product.price)}

        AuditService.log_action(
            db=db,
            action="UPDATE",
            entity_type="Product",
            entity_id=product.id,
            user_id=user_id,
            metadata=metadata
        )
        return product

    @staticmethod
    def add_image(
        db: Session,
        product_id: int,
        storage_key: str,
        url: str,
        alt_text: Optional[str] = None,
        sort_order: int = 0,
        is_primary: bool = False,
        width: Optional[int] = None,
        height: Optional[int] = None,
        file_size: Optional[int] = None,
        mime_type: Optional[str] = None
    ) -> ProductImage:
        # Se is_primary, remove o status primário das demais
        if is_primary:
            db.query(ProductImage).filter(ProductImage.product_id == product_id).update({"is_primary": False})

        image = ProductImage(
            product_id=product_id,
            storage_key=storage_key,
            url=url,
            alt_text=alt_text,
            sort_order=sort_order,
            is_primary=is_primary,
            width=width,
            height=height,
            file_size=file_size,
            mime_type=mime_type
        )
        db.add(image)
        db.commit()
        db.refresh(image)
        return image

    @staticmethod
    def publish(db: Session, product: Product, user_id: Optional[int] = None) -> Product:
        has_primary = any(img.is_primary for img in product.images)
        if not has_primary:
            raise ValueError("PUBLISH_NO_PRIMARY_IMAGE: É obrigatório possuir uma imagem principal para publicar o produto.")

        product.status = "PUBLISHED"
        if not product.published_at:
            product.published_at = datetime.datetime.utcnow()
        db.commit()
        db.refresh(product)

        AuditService.log_action(
            db=db,
            action="PUBLISH",
            entity_type="Product",
            entity_id=product.id,
            user_id=user_id
        )
        return product

    @staticmethod
    def unpublish(db: Session, product: Product, user_id: Optional[int] = None) -> Product:
        product.status = "DRAFT"
        db.commit()
        db.refresh(product)

        AuditService.log_action(
            db=db,
            action="UNPUBLISH",
            entity_type="Product",
            entity_id=product.id,
            user_id=user_id
        )
        return product

    @staticmethod
    def archive(db: Session, product: Product, user_id: Optional[int] = None) -> Product:
        product.status = "ARCHIVED"
        db.commit()
        db.refresh(product)

        AuditService.log_action(
            db=db,
            action="ARCHIVE",
            entity_type="Product",
            entity_id=product.id,
            user_id=user_id
        )
        return product

    @staticmethod
    def duplicate(db: Session, product: Product, user_id: Optional[int] = None) -> Product:
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

        # Copiar imagens do produto original
        for img in product.images:
            copy_img = ProductImage(
                product_id=new_product.id,
                storage_key=img.storage_key,
                url=img.url,
                alt_text=img.alt_text,
                sort_order=img.sort_order,
                is_primary=img.is_primary,
                width=img.width,
                height=img.height,
                file_size=img.file_size,
                mime_type=img.mime_type
            )
            db.add(copy_img)
        db.commit()
        db.refresh(new_product)

        AuditService.log_action(
            db=db,
            action="DUPLICATE",
            entity_type="Product",
            entity_id=new_product.id,
            user_id=user_id,
            metadata={"original_product_id": product.id}
        )
        return new_product
