from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class PurchaseOrderBase(BaseModel):
    supplier_id: int
    order_number: str
    order_date: datetime
    total_amount: float
    status: str = "Pending"


class PurchaseOrderCreate(PurchaseOrderBase):
    pass


class PurchaseItemInput(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)
    unit_price: float = Field(gt=0)


class PurchaseWithItemsCreate(PurchaseOrderBase):
    items: list[PurchaseItemInput] = Field(min_length=1)


class PurchaseOrderResponse(PurchaseOrderBase):
    purchase_order_id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)