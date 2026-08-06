from pydantic import BaseModel
from datetime import datetime


class InventoryCreate(BaseModel):
    product_id: int
    quantity: int
    minimum_stock: int
    location: str


class InventoryUpdate(BaseModel):
    product_id: int
    quantity: int
    minimum_stock: int
    location: str


class InventoryResponse(BaseModel):
    inventory_id: int
    product_id: int
    quantity: int
    minimum_stock: int
    location: str
    last_updated: datetime

    class Config:
        from_attributes = True