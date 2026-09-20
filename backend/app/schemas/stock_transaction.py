from datetime import datetime

from pydantic import BaseModel, ConfigDict


class StockTransactionBase(BaseModel):
    product_id: int
    transaction_type: str
    quantity: int
    transaction_date: datetime
    reason: str


class StockTransactionCreate(StockTransactionBase):
    pass


# ==========================================================
# STOCK OPERATION SCHEMAS
# ==========================================================

class StockInCreate(BaseModel):
    product_id: int
    quantity: int
    reason: str


class StockOutCreate(BaseModel):
    product_id: int
    quantity: int
    reason: str


class StockTransactionResponse(StockTransactionBase):
    transaction_id: int

    model_config = ConfigDict(from_attributes=True)