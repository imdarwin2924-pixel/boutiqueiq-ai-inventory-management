from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.api.category import router as category_router
from app.api.product import router as product_router
from app.api.inventory import router as inventory_router
from app.api.supplier import router as supplier_router
from app.api.customer import router as customer_router
from app.api.sale import router as sale_router
from app.api.purchase_order import router as purchase_order_router
from app.api.purchase_item import router as purchase_item_router
from app.api.stock_transaction import router as stock_transaction_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="BoutiqueIQ API",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
app.include_router(sale_router)
app.include_router(purchase_order_router)
app.include_router(purchase_item_router)
app.include_router(stock_transaction_router)

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