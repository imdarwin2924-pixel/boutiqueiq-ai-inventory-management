from sqlalchemy import Column, Integer, String

from app.database.database import Base


class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(Integer, primary_key=True, index=True)

    customer_name = Column(String(100), nullable=False)

    phone = Column(String(20))

    email = Column(String(100), unique=True)

    address = Column(String(255))