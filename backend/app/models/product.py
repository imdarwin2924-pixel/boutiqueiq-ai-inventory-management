from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.database.database import Base


class Product(Base):
    __tablename__ = "products"

    product_id = Column(Integer, primary_key=True, index=True)

    category_id = Column(
        Integer,
        ForeignKey("categories.category_id"),
        nullable=False
    )

    product_name = Column(String(100), nullable=False)
    sku = Column(String(50), unique=True)
    brand = Column(String(100))
    size = Column(String(20))
    color = Column(String(50))

    purchase_price = Column(Float)
    selling_price = Column(Float)

    stock_quantity = Column(Integer, default=0)

    category = relationship("Category")