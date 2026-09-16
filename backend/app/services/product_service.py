from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.product import Product
from app.models.category import Category

from app.schemas.product_schema import (
    ProductCreate,
    ProductUpdate,
)


def create_product(
    db: Session,
    product: ProductCreate,
):
    # Validate category
    category = (
        db.query(Category)
        .filter(
            Category.category_id == product.category_id
        )
        .first()
    )

    if category is None:
        raise ValueError(
            "Category not found."
        )

    # Check duplicate SKU
    if product.sku:
        existing = (
            db.query(Product)
            .filter(
                Product.sku == product.sku
            )
            .first()
        )

        if existing:
            raise ValueError(
                "SKU already exists."
            )

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

    try:
        db.add(new_product)
        db.commit()
        db.refresh(new_product)

    except IntegrityError:
        db.rollback()
        raise ValueError(
            "Unable to create product because of a database constraint."
        )

    return new_product


def get_all_products(db: Session):
    return db.query(Product).all()


def get_product_by_id(
    db: Session,
    product_id: int,
):
    return (
        db.query(Product)
        .filter(
            Product.product_id == product_id
        )
        .first()
    )


def update_product(
    db: Session,
    product_id: int,
    product: ProductUpdate,
):
    existing = get_product_by_id(
        db,
        product_id,
    )

    if not existing:
        raise ValueError(
            "Product not found."
        )

    # Validate category
    category = (
        db.query(Category)
        .filter(
            Category.category_id == product.category_id
        )
        .first()
    )

    if category is None:
        raise ValueError(
            "Category not found."
        )

    # Check duplicate SKU
    if product.sku:
        duplicate = (
            db.query(Product)
            .filter(
                Product.sku == product.sku,
                Product.product_id != product_id,
            )
            .first()
        )

        if duplicate:
            raise ValueError(
                "SKU already exists."
            )

    existing.category_id = product.category_id
    existing.product_name = product.product_name
    existing.sku = product.sku
    existing.brand = product.brand
    existing.size = product.size
    existing.color = product.color
    existing.purchase_price = product.purchase_price
    existing.selling_price = product.selling_price
    existing.stock_quantity = product.stock_quantity

    try:
        db.commit()
        db.refresh(existing)

    except IntegrityError:
        db.rollback()
        raise ValueError(
            "Unable to update product because of a database constraint."
        )

    return existing


def delete_product(
    db: Session,
    product_id: int,
):
    product = get_product_by_id(
        db,
        product_id,
    )

    if not product:
        raise ValueError(
            "Product not found."
        )

    try:
        db.delete(product)
        db.commit()

    except IntegrityError:
        db.rollback()

        raise ValueError(
            "Product cannot be deleted because it is referenced by existing records."
        )

    return {
        "message": "Product deleted successfully."
    }