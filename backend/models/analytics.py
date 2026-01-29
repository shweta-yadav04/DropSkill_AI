from sqlalchemy import Column, Integer, DateTime, ForeignKey, Float, Date
from sqlalchemy.orm import relationship
from datetime import datetime, date
from database import Base

class Analytics(Base):
    __tablename__ = "analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    date = Column(Date, default=date.today)
    
    # Traffic
    page_views = Column(Integer, default=0)
    unique_visitors = Column(Integer, default=0)
    
    # Sales
    orders_count = Column(Integer, default=0)
    revenue = Column(Float, default=0)
    avg_order_value = Column(Float, default=0)
    
    # Products
    products_viewed = Column(Integer, default=0)
    products_added_to_cart = Column(Integer, default=0)
    
    # Conversion
    conversion_rate = Column(Float, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    store = relationship("Store", back_populates="analytics")
    
    def __repr__(self):
        return f"<Analytics {self.store_id} - {self.date}>"
