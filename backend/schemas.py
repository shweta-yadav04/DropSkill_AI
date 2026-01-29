from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    role: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[int] = None

# Store Schemas
class StoreCreate(BaseModel):
    name: str = Field(..., min_length=2)
    description: Optional[str] = None
    template: str = "modern"
    primary_color: str = "#6366f1"

class StoreUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    template: Optional[str] = None
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None
    primary_color: Optional[str] = None
    is_active: Optional[bool] = None

class StoreResponse(BaseModel):
    id: int
    user_id: int
    name: str
    slug: str
    description: Optional[str]
    template: str
    logo_url: Optional[str]
    banner_url: Optional[str]
    primary_color: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Product Schemas
class ProductCreate(BaseModel):
    sku: str
    name: str
    description: Optional[str] = None
    category: str
    subcategory: Optional[str] = None
    cost_price: float
    base_price: float
    suggested_retail: float
    stock_quantity: int = 0
    image_url: Optional[str] = None
    images: List[str] = []
    specifications: dict = {}
    tags: List[str] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    cost_price: Optional[float] = None
    base_price: Optional[float] = None
    suggested_retail: Optional[float] = None
    stock_quantity: Optional[int] = None
    image_url: Optional[str] = None
    images: Optional[List[str]] = None
    specifications: Optional[dict] = None
    tags: Optional[List[str]] = None
    demand_score: Optional[float] = None
    is_active: Optional[bool] = None

class ProductResponse(BaseModel):
    id: int
    sku: str
    name: str
    description: Optional[str]
    category: str
    subcategory: Optional[str]
    cost_price: float
    base_price: float
    suggested_retail: float
    stock_quantity: int
    image_url: Optional[str]
    images: List[str]
    specifications: dict
    tags: List[str]
    demand_score: float
    margin_potential: float
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Store Product Schemas
class StoreProductCreate(BaseModel):
    product_id: int
    custom_name: Optional[str] = None
    custom_description: Optional[str] = None
    custom_price: Optional[float] = None
    is_featured: bool = False

class StoreProductUpdate(BaseModel):
    custom_name: Optional[str] = None
    custom_description: Optional[str] = None
    custom_price: Optional[float] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None

class StoreProductResponse(BaseModel):
    id: int
    store_id: int
    product_id: int
    custom_name: Optional[str]
    custom_description: Optional[str]
    custom_price: Optional[float]
    is_featured: bool
    is_active: bool
    product: ProductResponse
    
    class Config:
        from_attributes = True

# AI Schemas
class AIRecommendRequest(BaseModel):
    store_id: Optional[int] = None
    query: str
    context: Optional[str] = None

class AIRecommendResponse(BaseModel):
    recommendations: List[dict]
    insights: str
    suggested_actions: List[str]

class AIChatRequest(BaseModel):
    store_id: Optional[int] = None
    message: str
    conversation_history: List[dict] = []

class AIChatResponse(BaseModel):
    response: str
    suggested_products: Optional[List[int]] = None
    action_items: Optional[List[str]] = None

# Analytics Schemas
class AnalyticsSummary(BaseModel):
    total_revenue: float
    total_orders: int
    total_products: int
    avg_order_value: float
    top_products: List[dict]
    recent_orders: List[dict]
