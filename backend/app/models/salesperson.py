import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.core.database import Base

class Salesperson(Base):
    __tablename__ = "salespeople"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    whatsapp_number = Column(String(20), nullable=False, unique=True)
    is_active = Column(Boolean, default=True, nullable=False)
    assignment_count = Column(Integer, default=0, nullable=False)  # Contador para round-robin
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    store = relationship("Store", back_populates="salespeople")
