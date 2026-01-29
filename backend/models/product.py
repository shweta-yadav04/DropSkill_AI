from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Product(Base):
    """Central supplier inventory - managed by admin"""
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(String(100), nullable=False, index=True)
    subcategory = Column(String(100))
    
    # Pricing
    cost_price = Column(Float, nullable=False)  # What we pay
    base_price = Column(Float, nullable=False)  # Suggested wholesale
    suggested_retail = Column(Float, nullable=False)  # MSRP
    
    # Inventory
    stock_quantity = Column(Integer, default=0)
    low_stock_threshold = Column(Integer, default=10)
    
    # Media
    image_url = Column(String(500))
    images = Column(JSON, default=list)  # Array of image URLs
    
    # Metadata
    specifications = Column(JSON, default=dict)
    tags = Column(JSON, default=list)
    
    # AI Metrics
    demand_score = Column(Float, default=0.5)  # 0-1 popularity score
    margin_potential = Column(Float, default=0.3)  # Suggested margin
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    store_products = relationship("StoreProduct", back_populates="product")
    
    def __repr__(self):
        return f"<Product {self.name}>"


class StoreProduct(Base):
    """Products imported into seller stores"""
    __tablename__ = "store_products"
    
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    # Seller customization
    custom_name = Column(String(255))
    custom_description = Column(Text)
    custom_price = Column(Float)  # Seller's price
    
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    store = relationship("Store", back_populates="store_products")
    product = relationship("Product", back_populates="store_products")
    
    def __repr__(self):
        return f"<StoreProduct {self.id}>"
