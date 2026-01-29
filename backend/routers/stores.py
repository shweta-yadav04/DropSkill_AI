from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
import re

from database import get_db
from models.user import User
from models.store import Store
from models.product import StoreProduct
from schemas import StoreCreate, StoreUpdate, StoreResponse, StoreProductResponse
from auth import get_current_user

router = APIRouter(prefix="/api/stores", tags=["Stores"])

def generate_slug(name: str) -> str:
    """Generate URL-friendly slug from store name"""
    slug = re.sub(r'[^a-zA-Z0-9\s-]', '', name.lower())
    slug = re.sub(r'[\s_]+', '-', slug)
    return slug.strip('-')

@router.post("", response_model=StoreResponse)
async def create_store(
    store_data: StoreCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new store"""
    base_slug = generate_slug(store_data.name)
    slug = base_slug
    counter = 1
    
    # Ensure unique slug
    while True:
        result = await db.execute(select(Store).where(Store.slug == slug))
        if not result.scalar_one_or_none():
            break
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    store = Store(
        user_id=current_user.id,
        name=store_data.name,
        slug=slug,
        description=store_data.description,
        template=store_data.template,
        primary_color=store_data.primary_color
    )
    db.add(store)
    await db.commit()
    await db.refresh(store)
    return store

@router.get("/my", response_model=List[StoreResponse])
async def get_my_stores(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all stores owned by current user"""
    result = await db.execute(
        select(Store).where(Store.user_id == current_user.id).order_by(Store.created_at.desc())
    )
    return result.scalars().all()

@router.get("/{store_id}", response_model=StoreResponse)
async def get_store(
    store_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get store by ID"""
    result = await db.execute(select(Store).where(Store.id == store_id))
    store = result.scalar_one_or_none()
    
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    if store.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your store")
    
    return store

@router.put("/{store_id}", response_model=StoreResponse)
async def update_store(
    store_id: int,
    store_data: StoreUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update store settings"""
    result = await db.execute(select(Store).where(Store.id == store_id))
    store = result.scalar_one_or_none()
    
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    if store.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your store")
    
    update_data = store_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(store, field, value)
    
    await db.commit()
    await db.refresh(store)
    return store

@router.delete("/{store_id}")
async def delete_store(
    store_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a store"""
    result = await db.execute(select(Store).where(Store.id == store_id))
    store = result.scalar_one_or_none()
    
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    if store.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your store")
    
    await db.delete(store)
    await db.commit()
    return {"message": "Store deleted"}

# Public storefront endpoint (no auth required)
@router.get("/public/{slug}")
async def get_public_store(slug: str, db: AsyncSession = Depends(get_db)):
    """Get public storefront data by slug"""
    result = await db.execute(
        select(Store)
        .options(selectinload(Store.store_products).selectinload(StoreProduct.product))
        .where(Store.slug == slug, Store.is_active == True)
    )
    store = result.scalar_one_or_none()
    
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    # Format response for public consumption
    products = []
    for sp in store.store_products:
        if sp.is_active and sp.product.is_active:
            products.append({
                "id": sp.id,
                "name": sp.custom_name or sp.product.name,
                "description": sp.custom_description or sp.product.description,
                "price": sp.custom_price or sp.product.suggested_retail,
                "image_url": sp.product.image_url,
                "images": sp.product.images,
                "category": sp.product.category,
                "is_featured": sp.is_featured,
                "in_stock": sp.product.stock_quantity > 0
            })
    
    return {
        "id": store.id,
        "name": store.name,
        "slug": store.slug,
        "description": store.description,
        "template": store.template,
        "logo_url": store.logo_url,
        "banner_url": store.banner_url,
        "primary_color": store.primary_color,
        "products": products
    }
