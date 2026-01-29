from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Store(Base):
    __tablename__ = "stores"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(Text)
    template = Column(String(50), default="modern")  # modern, minimal, bold
    logo_url = Column(String(500))
    banner_url = Column(String(500))
    primary_color = Column(String(7), default="#6366f1")  # Indigo
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    owner = relationship("User", back_populates="stores")
    store_products = relationship("StoreProduct", back_populates="store", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="store", cascade="all, delete-orphan")
    analytics = relationship("Analytics", back_populates="store", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Store {self.name}>"
