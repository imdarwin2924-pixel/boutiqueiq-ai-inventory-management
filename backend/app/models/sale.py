from datetime import datetime

from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey

from app.database.database import Base


class Sale(Base):
    __tablename__ = "sales"

    sale_id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(
        Integer,
        ForeignKey("customers.customer_id"),
        nullable=False
    )

    user_id = Column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=False
    )

    invoice_number = Column(String(50), unique=True, nullable=False)

    sale_date = Column(DateTime, default=datetime.utcnow, nullable=False)

    total_amount = Column(Float, nullable=False)

    payment_method = Column(String(50), nullable=False)