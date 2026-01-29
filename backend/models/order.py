from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base

class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    order_number = Column(String(50), unique=True, nullable=False)
    
    # Customer info
    customer_name = Column(String(255), nullable=False)
    customer_email = Column(String(255), nullable=False)
    customer_phone = Column(String(50))
    shipping_address = Column(JSON)
    
    # Financials
    subtotal = Column(Float, nullable=False)
    shipping_cost = Column(Float, default=0)
    tax = Column(Float, default=0)
    total_amount = Column(Float, nullable=False)
    
    status = Column(String(50), default=OrderStatus.PENDING.value)
    notes = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    store = relationship("Store", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Order {self.order_number}>"


class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    
    # Relationships
    order = relationship("Order", back_populates="items")
    
    def __repr__(self):
        return f"<OrderItem {self.id}>"
