from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Optional

from database import get_db
from models.user import User
from models.store import Store
from models.product import Product, StoreProduct
from schemas import (
    ProductResponse, StoreProductCreate, StoreProductUpdate, StoreProductResponse
)
from auth import get_current_user

router = APIRouter(prefix="/api", tags=["Products"])

@router.get("/products", response_model=List[ProductResponse])
async def browse_catalog(
    db: AsyncSession = Depends(get_db),
    category: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    in_stock: Optional[bool] = None,
    sort_by: str = Query("demand_score", regex="^(name|base_price|demand_score|created_at)$"),
    order: str = Query("desc", regex="^(asc|desc)$"),
    limit: int = Query(50, le=100),
    offset: int = 0,
    current_user: User = Depends(get_current_user)
):
    """Browse supplier product catalog"""
    query = select(Product).where(Product.is_active == True)
    
    if category:
        query = query.where(Product.category == category)
    if search:
        query = query.where(Product.name.ilike(f"%{search}%"))
    if min_price:
        query = query.where(Product.suggested_retail >= min_price)
    if max_price:
        query = query.where(Product.suggested_retail <= max_price)
    if in_stock:
        query = query.where(Product.stock_quantity > 0)
    
    # Sorting
    sort_column = getattr(Product, sort_by)
    if order == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())
    
    query = query.offset(offset).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get product details"""
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/products/categories/list")
async def get_categories(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all product categories"""
    result = await db.execute(
        select(Product.category).where(Product.is_active == True).distinct()
    )
    categories = [row[0] for row in result.all()]
    return {"categories": categories}

# Store Products - Import/manage products in seller's store
@router.post("/stores/{store_id}/products", response_model=StoreProductResponse)
async def import_product(
    store_id: int,
    data: StoreProductCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Import a product from catalog to store (1-click import)"""
    # Verify store ownership
    result = await db.execute(select(Store).where(Store.id == store_id))
    store = result.scalar_one_or_none()
    
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    if store.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your store")
    
    # Verify product exists
    result = await db.execute(select(Product).where(Product.id == data.product_id))
    product = result.scalar_one_or_none()
    
    if not product or not product.is_active:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if already imported
    result = await db.execute(
        select(StoreProduct).where(
            StoreProduct.store_id == store_id,
            StoreProduct.product_id == data.product_id
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Product already in store")
    
    # Create store product
    store_product = StoreProduct(
        store_id=store_id,
        product_id=data.product_id,
        custom_name=data.custom_name,
        custom_description=data.custom_description,
        custom_price=data.custom_price or product.suggested_retail,
        is_featured=data.is_featured
    )
    db.add(store_product)
    await db.commit()
    
    # Reload with product relationship
    result = await db.execute(
        select(StoreProduct)
        .options(selectinload(StoreProduct.product))
        .where(StoreProduct.id == store_product.id)
    )
    return result.scalar_one()

@router.get("/stores/{store_id}/products", response_model=List[StoreProductResponse])
async def get_store_products(
    store_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all products in a store"""
    # Verify store ownership
    result = await db.execute(select(Store).where(Store.id == store_id))
    store = result.scalar_one_or_none()
    
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    if store.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your store")
    
    result = await db.execute(
        select(StoreProduct)
        .options(selectinload(StoreProduct.product))
        .where(StoreProduct.store_id == store_id)
        .order_by(StoreProduct.is_featured.desc(), StoreProduct.created_at.desc())
    )
    return result.scalars().all()

@router.put("/stores/{store_id}/products/{product_id}", response_model=StoreProductResponse)
async def update_store_product(
    store_id: int,
    product_id: int,
    data: StoreProductUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a product in seller's store"""
    # Verify store ownership
    result = await db.execute(select(Store).where(Store.id == store_id))
    store = result.scalar_one_or_none()
    
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    if store.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your store")
    
    result = await db.execute(
        select(StoreProduct)
        .options(selectinload(StoreProduct.product))
        .where(StoreProduct.store_id == store_id, StoreProduct.id == product_id)
    )
    store_product = result.scalar_one_or_none()
    
    if not store_product:
        raise HTTPException(status_code=404, detail="Product not in store")
    
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(store_product, field, value)
    
    await db.commit()
    await db.refresh(store_product)
    return store_product

@router.delete("/stores/{store_id}/products/{product_id}")
async def remove_store_product(
    store_id: int,
    product_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove a product from seller's store"""
    # Verify store ownership
    result = await db.execute(select(Store).where(Store.id == store_id))
    store = result.scalar_one_or_none()
    
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    if store.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your store")
    
    result = await db.execute(
        select(StoreProduct).where(
            StoreProduct.store_id == store_id,
            StoreProduct.id == product_id
        )
    )
    store_product = result.scalar_one_or_none()
    
    if not store_product:
        raise HTTPException(status_code=404, detail="Product not in store")
    
    await db.delete(store_product)
    await db.commit()
    return {"message": "Product removed from store"}
