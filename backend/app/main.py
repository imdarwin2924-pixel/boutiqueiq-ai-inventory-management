from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.api.category import router as category_router
from app.api.product import router as product_router
from app.api.inventory import router as inventory_router
from app.api.supplier import router as supplier_router
from app.api.customer import router as customer_router

app = FastAPI(
    title="BoutiqueIQ API",
    version="1.0.0"
)

app.include_router(auth_router)
app.include_router(
    category_router,
    prefix="/categories",
    tags=["Category Management"]
)
app.include_router(
    product_router,
    prefix="/products",
    tags=["Product Management"]
)
app.include_router(
    inventory_router,
    prefix="/inventory",
    tags=["Inventory Management"]
)
app.include_router(
    supplier_router,
    prefix="/suppliers",
    tags=["Supplier Management"]
)
app.include_router(
    customer_router,
    prefix="/customers",
    tags=["Customer Management"]
)
@app.get("/")
def root():
    return {
        "message": "Welcome to BoutiqueIQ API"
    }


@app.get("/health")
def health():
    return {
        "status": "OK"
    }