from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional

from database import get_db
from models.user import User
from models.store import Store
from models.product import Product, StoreProduct
from models.order import Order
from schemas import AIRecommendRequest, AIRecommendResponse, AIChatRequest, AIChatResponse
from auth import get_current_user
from ai.recommender import AIRecommender

router = APIRouter(prefix="/api/ai", tags=["AI Assistant"])

recommender = AIRecommender()

@router.post("/recommend", response_model=AIRecommendResponse)
async def get_recommendations(
    request: AIRecommendRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get AI-powered product recommendations"""
    # Get context data
    store_data = None
    if request.store_id:
        result = await db.execute(select(Store).where(Store.id == request.store_id))
        store = result.scalar_one_or_none()
        if store and store.user_id == current_user.id:
            # Get store products
            result = await db.execute(
                select(StoreProduct).where(StoreProduct.store_id == request.store_id)
            )
            store_products = result.scalars().all()
            store_data = {
                "name": store.name,
                "product_count": len(store_products),
                "product_ids": [sp.product_id for sp in store_products]
            }
    
    # Get trending products
    result = await db.execute(
        select(Product)
        .where(Product.is_active == True)
        .order_by(Product.demand_score.desc())
        .limit(20)
    )
    trending_products = result.scalars().all()
    
    # Generate recommendations
    recommendations = recommender.get_product_recommendations(
        query=request.query,
        store_data=store_data,
        available_products=[
            {"id": p.id, "name": p.name, "category": p.category, "demand_score": p.demand_score, "price": p.suggested_retail}
            for p in trending_products
        ]
    )
    
    return recommendations

@router.post("/chat", response_model=AIChatResponse)
async def chat_with_ai(
    request: AIChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Chat with AI assistant for ecommerce guidance"""
    # Build context
    context = {"user_name": current_user.full_name or current_user.email.split("@")[0]}
    
    if request.store_id:
        result = await db.execute(select(Store).where(Store.id == request.store_id))
        store = result.scalar_one_or_none()
        if store and store.user_id == current_user.id:
            # Get store stats
            result = await db.execute(
                select(func.count(StoreProduct.id)).where(StoreProduct.store_id == request.store_id)
            )
            product_count = result.scalar() or 0
            
            result = await db.execute(
                select(func.count(Order.id)).where(Order.store_id == request.store_id)
            )
            order_count = result.scalar() or 0
            
            context["store"] = {
                "name": store.name,
                "products": product_count,
                "orders": order_count
            }
    
    # Get AI response
    response = recommender.chat(
        message=request.message,
        conversation_history=request.conversation_history,
        context=context
    )
    
    return response

@router.get("/insights/{store_id}")
async def get_store_insights(
    store_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get AI-generated insights for a store"""
    # Verify store ownership
    result = await db.execute(select(Store).where(Store.id == store_id))
    store = result.scalar_one_or_none()
    
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    if store.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your store")
    
    # Get store products
    result = await db.execute(
        select(StoreProduct)
        .where(StoreProduct.store_id == store_id, StoreProduct.is_active == True)
    )
    store_products = result.scalars().all()
    product_ids = [sp.product_id for sp in store_products]
    
    # Get product details
    products = []
    if product_ids:
        result = await db.execute(
            select(Product).where(Product.id.in_(product_ids))
        )
        products = result.scalars().all()
    
    # Get all catalog products for gap analysis
    result = await db.execute(
        select(Product)
        .where(Product.is_active == True)
        .order_by(Product.demand_score.desc())
    )
    all_products = result.scalars().all()
    
    # Generate insights
    insights = recommender.generate_insights(
        store_name=store.name,
        store_products=[{"id": p.id, "name": p.name, "category": p.category, "demand_score": p.demand_score} for p in products],
        all_products=[{"id": p.id, "name": p.name, "category": p.category, "demand_score": p.demand_score} for p in all_products]
    )
    
    return insights
