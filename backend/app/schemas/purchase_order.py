from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PurchaseOrderBase(BaseModel):
    supplier_id: int
    user_id: int
    order_number: str
    order_date: datetime
    total_amount: float
    status: str = "Pending"


class PurchaseOrderCreate(PurchaseOrderBase):
    pass


class PurchaseOrderResponse(PurchaseOrderBase):
    purchase_order_id: int

    model_config = ConfigDict(from_attributes=True)