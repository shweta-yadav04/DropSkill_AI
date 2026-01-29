from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
from datetime import datetime, timedelta

from database import get_db
from models.user import User
from models.store import Store
from models.product import Product
from models.order import Order
from models.analytics import Analytics
from schemas import ProductCreate, ProductUpdate, ProductResponse
from auth import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.post("/products", response_model=ProductResponse)
async def create_product(
    product_data: ProductCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Add a new product to supplier inventory"""
    # Check SKU unique
    result = await db.execute(select(Product).where(Product.sku == product_data.sku))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="SKU already exists")
    
    product = Product(**product_data.model_dump())
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return product

@router.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Update product in supplier inventory"""
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)
    
    await db.commit()
    await db.refresh(product)
    return product

@router.delete("/products/{product_id}")
async def delete_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Delete product from inventory"""
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Soft delete
    product.is_active = False
    await db.commit()
    return {"message": "Product deactivated"}

@router.get("/products", response_model=List[ProductResponse])
async def list_all_products(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
    include_inactive: bool = False
):
    """List all products (admin view)"""
    query = select(Product)
    if not include_inactive:
        query = query.where(Product.is_active == True)
    query = query.order_by(Product.created_at.desc())
    
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/analytics")
async def get_platform_analytics(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Get platform-wide analytics"""
    # Total counts
    users_count = await db.execute(select(func.count(User.id)))
    stores_count = await db.execute(select(func.count(Store.id)))
    products_count = await db.execute(select(func.count(Product.id)).where(Product.is_active == True))
    orders_count = await db.execute(select(func.count(Order.id)))
    
    # Revenue
    total_revenue = await db.execute(select(func.sum(Order.total_amount)))
    
    # Recent activity
    recent_orders = await db.execute(
        select(Order).order_by(Order.created_at.desc()).limit(10)
    )
    
    # Low stock products
    low_stock = await db.execute(
        select(Product)
        .where(Product.stock_quantity < Product.low_stock_threshold, Product.is_active == True)
        .limit(10)
    )
    
    return {
        "total_users": users_count.scalar() or 0,
        "total_stores": stores_count.scalar() or 0,
        "total_products": products_count.scalar() or 0,
        "total_orders": orders_count.scalar() or 0,
        "total_revenue": total_revenue.scalar() or 0,
        "recent_orders": [
            {"id": o.id, "order_number": o.order_number, "total": o.total_amount, "status": o.status}
            for o in recent_orders.scalars().all()
        ],
        "low_stock_products": [
            {"id": p.id, "name": p.name, "sku": p.sku, "stock": p.stock_quantity}
            for p in low_stock.scalars().all()
        ]
    }

@router.post("/users/{user_id}/make-admin")
async def make_user_admin(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Promote user to admin"""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.role = "admin"
    await db.commit()
    return {"message": f"User {user.email} is now an admin"}
