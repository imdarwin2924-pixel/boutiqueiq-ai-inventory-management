from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey

from app.database.database import Base


class StockTransaction(Base):
    __tablename__ = "stock_transactions"

    transaction_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    product_id = Column(
        Integer,
        ForeignKey("products.product_id"),
        nullable=False
    )

    transaction_type = Column(
        String(20),
        nullable=False
    )

    quantity = Column(
        Integer,
        nullable=False
    )

    transaction_date = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    reason = Column(
        String(255),
        nullable=False
    )