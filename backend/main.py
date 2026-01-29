from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import settings
from database import init_db
from routers import auth_router, stores_router, products_router, admin_router, ai_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    await seed_initial_data()
    yield
    # Shutdown

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered ecommerce platform for dropshipping sellers",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)
app.include_router(stores_router)
app.include_router(products_router)
app.include_router(admin_router)
app.include_router(ai_router)

@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

async def seed_initial_data():
    """Seed initial products and admin user"""
    import json
    from pathlib import Path
    from sqlalchemy import select
    from database import async_session
    from models.user import User
    from models.product import Product
    from auth import get_password_hash
    
    async with async_session() as db:
        # Check if already seeded
        result = await db.execute(select(User).limit(1))
        if result.scalar_one_or_none():
            return
        
        # Create admin user
        admin = User(
            email="admin@dropskill.ai",
            password_hash=get_password_hash("admin123"),
            full_name="Admin User",
            role="admin"
        )
        db.add(admin)
        
        # Load products from JSON
        products_file = Path(__file__).parent / "data" / "products.json"
        if products_file.exists():
            with open(products_file, "r") as f:
                products_data = json.load(f)
            
            for p in products_data:
                product = Product(**p)
                db.add(product)
        
        await db.commit()
        print("✅ Initial data seeded successfully!")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
