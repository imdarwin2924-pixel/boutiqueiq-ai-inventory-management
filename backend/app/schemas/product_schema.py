from pydantic import BaseModel


class ProductCreate(BaseModel):
    category_id: int
    product_name: str
    sku: str
    brand: str
    size: str
    color: str
    purchase_price: float
    selling_price: float
    stock_quantity: int


class ProductUpdate(BaseModel):
    category_id: int
    product_name: str
    sku: str
    brand: str
    size: str
    color: str
    purchase_price: float
    selling_price: float
    stock_quantity: int


class ProductResponse(BaseModel):
    product_id: int
    category_id: int
    product_name: str
    sku: str
    brand: str
    size: str
    color: str
    purchase_price: float
    selling_price: float
    stock_quantity: int

    class Config:
        from_attributes = True