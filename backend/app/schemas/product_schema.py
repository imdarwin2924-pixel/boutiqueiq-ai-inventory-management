from pydantic import BaseModel, ConfigDict, Field


class ProductCreate(BaseModel):
    category_id: int

    product_name: str = Field(
        min_length=1,
        max_length=100
    )

    sku: str = Field(
        min_length=1,
        max_length=50
    )

    brand: str = Field(
        min_length=1,
        max_length=100
    )

    size: str = Field(
        min_length=1,
        max_length=20
    )

    color: str = Field(
        min_length=1,
        max_length=50
    )

    purchase_price: float = Field(
        gt=0
    )

    selling_price: float = Field(
        gt=0
    )


class ProductUpdate(BaseModel):
    category_id: int

    product_name: str = Field(
        min_length=1,
        max_length=100
    )

    sku: str = Field(
        min_length=1,
        max_length=50
    )

    brand: str = Field(
        min_length=1,
        max_length=100
    )

    size: str = Field(
        min_length=1,
        max_length=20
    )

    color: str = Field(
        min_length=1,
        max_length=50
    )

    purchase_price: float = Field(
        gt=0
    )

    selling_price: float = Field(
        gt=0
    )


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

    # Kept for backward compatibility.
    #
    # IMPORTANT:
    # Operational stock is managed through
    # inventory.quantity, not products.stock_quantity.
    stock_quantity: int

    model_config = ConfigDict(
        from_attributes=True
    )