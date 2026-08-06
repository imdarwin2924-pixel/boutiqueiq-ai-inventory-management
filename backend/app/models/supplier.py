from sqlalchemy import Column, Integer, String

from app.database.database import Base


class Supplier(Base):
    __tablename__ = "suppliers"

    supplier_id = Column(Integer, primary_key=True, index=True)

    supplier_name = Column(String(100), nullable=False)

    contact_person = Column(String(100))

    phone = Column(String(20))

    email = Column(String(100), unique=True)

    address = Column(String(255))