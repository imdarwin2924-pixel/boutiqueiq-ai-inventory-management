from sqlalchemy import Column, Integer, Float, ForeignKey

from app.database.database import Base


class PurchaseItem(Base):
    __tablename__ = "purchase_items"

    purchase_item_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    purchase_order_id = Column(
        Integer,
        ForeignKey("purchase_orders.purchase_order_id"),
        nullable=False
    )

    product_id = Column(
        Integer,
        ForeignKey("products.product_id"),
        nullable=False
    )

    quantity = Column(
        Integer,
        nullable=False
    )

    unit_price = Column(
        Float,
        nullable=False
    )

    subtotal = Column(
        Float,
        nullable=False
    )