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


class StockTransactionResponse(StockTransactionBase):
    transaction_id: int

    model_config = ConfigDict(from_attributes=True)