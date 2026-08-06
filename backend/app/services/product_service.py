from sqlalchemy.orm import Session

from app.models.product import Product
from app.schemas.product_schema import (
    ProductCreate,
    ProductUpdate,
)


def create_product(db: Session, product: ProductCreate):

    existing = (
        db.query(Product)
        .filter(Product.sku == product.sku)
        .first()
    )

    if existing:
        raise ValueError("SKU already exists.")

    new_product = Product(
        category_id=product.category_id,
        product_name=product.product_name,
        sku=product.sku,
        brand=product.brand,
        size=product.size,
        color=product.color,
        purchase_price=product.purchase_price,
        selling_price=product.selling_price,
        stock_quantity=product.stock_quantity,
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


def get_all_products(db: Session):
    return db.query(Product).all()


def get_product_by_id(db: Session, product_id: int):
    return (
        db.query(Product)
        .filter(Product.product_id == product_id)
        .first()
    )


def update_product(
    db: Session,
    product_id: int,
    product: ProductUpdate,
):

    existing = get_product_by_id(db, product_id)

    if not existing:
        raise ValueError("Product not found.")

    existing.category_id = product.category_id
    existing.product_name = product.product_name
    existing.sku = product.sku
    existing.brand = product.brand
    existing.size = product.size
    existing.color = product.color
    existing.purchase_price = product.purchase_price
    existing.selling_price = product.selling_price
    existing.stock_quantity = product.stock_quantity

    db.commit()
    db.refresh(existing)

    return existing


def delete_product(db: Session, product_id: int):

    product = get_product_by_id(db, product_id)

    if not product:
        raise ValueError("Product not found.")

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully."}