import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float, Index
from sqlalchemy.orm import relationship
from app.core.database import Base

class Store(Base):
    __tablename__ = "stores"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    type = Column(String(20), default="Filial", nullable=False)  # Matriz ou Filial
    city = Column(String(100), nullable=False)
    state = Column(String(2), default="PI", nullable=False)
    address = Column(Text, nullable=True)
    whatsapp_number = Column(String(20), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    sort_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    salespeople = relationship("Salesperson", back_populates="store", cascade="all, delete-orphan")
