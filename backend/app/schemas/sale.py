from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class SaleBase(BaseModel):
    customer_id: int
    invoice_number: str
    sale_date: datetime
    total_amount: float
    payment_method: str


class SaleCreate(SaleBase):
    pass


# ==========================================================
# SALE ITEM INPUT
# ==========================================================

class SaleItemInput(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)
    unit_price: float = Field(gt=0)


# ==========================================================
# SALE WITH ITEMS
# ==========================================================

class SaleWithItemsCreate(SaleBase):
    items: list[SaleItemInput] = Field(min_length=1)


class SaleResponse(SaleBase):
    sale_id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)