from pydantic import BaseModel, ConfigDict


class PurchaseItemBase(BaseModel):
    purchase_order_id: int
    product_id: int
    quantity: int
    unit_price: float
    subtotal: float


class PurchaseItemCreate(PurchaseItemBase):
    pass


class PurchaseItemResponse(PurchaseItemBase):
    purchase_item_id: int

    model_config = ConfigDict(from_attributes=True)