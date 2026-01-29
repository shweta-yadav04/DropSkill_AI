from routers.auth import router as auth_router
from routers.stores import router as stores_router
from routers.products import router as products_router
from routers.admin import router as admin_router
from routers.ai import router as ai_router

__all__ = ["auth_router", "stores_router", "products_router", "admin_router", "ai_router"]
