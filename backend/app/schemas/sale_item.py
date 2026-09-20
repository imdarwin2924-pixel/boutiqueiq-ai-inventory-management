from pydantic import BaseModel, ConfigDict


class SaleItemBase(BaseModel):
    product_id: int
    quantity: int
    unit_price: float
    subtotal: float


class SaleItemCreate(SaleItemBase):
    pass


class SaleItemResponse(SaleItemBase):
    sale_item_id: int
    sale_id: int

    model_config = ConfigDict(from_attributes=True)