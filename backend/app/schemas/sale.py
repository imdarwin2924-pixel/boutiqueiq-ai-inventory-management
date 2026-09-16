from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SaleBase(BaseModel):
    customer_id: int
    invoice_number: str
    sale_date: datetime
    total_amount: float
    payment_method: str


class SaleCreate(SaleBase):
    pass


class SaleResponse(SaleBase):
    sale_id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)