import datetime
from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.core.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False, index=True)
    name = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    sku = Column(String(50), unique=True, index=True, nullable=True)
    brand = Column(String(100), nullable=True)
    group_name = Column(String(100), nullable=True)
    subgroup = Column(String(100), nullable=True, index=True)
    short_description = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    old_price = Column(Numeric(10, 2), nullable=True)
    promo_price = Column(Numeric(10, 2), nullable=True)
    payment_condition = Column(String(200), nullable=True)
    dimensions = Column(String(100), nullable=True)
    weight = Column(String(50), nullable=True)
    material = Column(String(100), nullable=True)
    color = Column(String(100), nullable=True)
    availability = Column(String(50), default="Pronta Entrega", nullable=False)
    stock = Column(Integer, nullable=True)
    is_featured = Column(Boolean, default=False, nullable=False)
    status = Column(String(20), default="DRAFT", nullable=False)  # DRAFT, PUBLISHED, ARCHIVED
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)
    published_at = Column(DateTime, nullable=True)

    category = relationship("Category", back_populates="products")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan", order_by="ProductImage.sort_order")
    offer = relationship("Offer", back_populates="product", uselist=False, cascade="all, delete-orphan")

class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    storage_key = Column(String(500), nullable=False)
    url = Column(String(500), nullable=False)
    alt_text = Column(String(255), nullable=True)
    sort_order = Column(Integer, default=0, nullable=False)
    is_primary = Column(Boolean, default=False, nullable=False)
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    file_size = Column(Integer, nullable=True)
    mime_type = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    product = relationship("Product", back_populates="images")
