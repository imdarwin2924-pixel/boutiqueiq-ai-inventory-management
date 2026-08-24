from datetime import datetime

from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey

from app.database.database import Base


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    purchase_order_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    supplier_id = Column(
        Integer,
        ForeignKey("suppliers.supplier_id"),
        nullable=False
    )

    user_id = Column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=False
    )

    order_number = Column(
        String(50),
        unique=True,
        nullable=False
    )

    order_date = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    total_amount = Column(
        Float,
        nullable=False
    )

    status = Column(
        String(30),
        default="Pending",
        nullable=False
    )