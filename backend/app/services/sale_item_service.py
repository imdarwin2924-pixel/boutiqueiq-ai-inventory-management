from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.sale import Sale
from app.models.sale_item import SaleItem
from app.models.product import Product
from app.schemas.sale_item import SaleItemCreate


def create_sale_item(
    db: Session,
    sale_item: SaleItemCreate,
    sale_id: int,
):
    # Check sale exists
    sale = (
        db.query(Sale)
        .filter(Sale.sale_id == sale_id)
        .first()
    )

    if sale is None:
        raise ValueError("Sale not found.")

    # Check product exists
    product = (
        db.query(Product)
        .filter(Product.product_id == sale_item.product_id)
        .first()
    )

    if product is None:
        raise ValueError("Product not found.")

    # Validate quantity
    if sale_item.quantity <= 0:
        raise ValueError(
            "Quantity must be greater than zero."
        )

    # Validate unit price
    if sale_item.unit_price <= 0:
        raise ValueError(
            "Unit price must be greater than zero."
        )

    # Validate subtotal
    calculated_subtotal = (
        sale_item.quantity * sale_item.unit_price
    )

    if abs(
        calculated_subtotal - sale_item.subtotal
    ) > 0.01:
        raise ValueError(
            "Subtotal does not match quantity × unit price."
        )

    new_sale_item = SaleItem(
        sale_id=sale_id,
        product_id=sale_item.product_id,
        quantity=sale_item.quantity,
        unit_price=sale_item.unit_price,
        subtotal=calculated_subtotal,
    )

    try:
        db.add(new_sale_item)
        db.commit()
        db.refresh(new_sale_item)

    except IntegrityError:
        db.rollback()
        raise ValueError(
            "Unable to create sale item because of a database constraint."
        )

    return new_sale_item


def get_all_sale_items(
    db: Session,
):
    return (
        db.query(SaleItem)
        .order_by(
            SaleItem.sale_item_id.desc()
        )
        .all()
    )


def get_sale_item_by_id(
    db: Session,
    sale_item_id: int,
):
    return (
        db.query(SaleItem)
        .filter(
            SaleItem.sale_item_id == sale_item_id
        )
        .first()
    )


def get_sale_items_by_sale_id(
    db: Session,
    sale_id: int,
):
    return (
        db.query(SaleItem)
        .filter(
            SaleItem.sale_id == sale_id
        )
        .order_by(
            SaleItem.sale_item_id.asc()
        )
        .all()
    )


def update_sale_item(
    db: Session,
    sale_item_id: int,
    sale_item: SaleItemCreate,
):
    existing_item = (
        db.query(SaleItem)
        .filter(
            SaleItem.sale_item_id == sale_item_id
        )
        .first()
    )

    if existing_item is None:
        return None

    # Check sale exists
    sale = (
        db.query(Sale)
        .filter(
            Sale.sale_id == existing_item.sale_id
        )
        .first()
    )

    if sale is None:
        raise ValueError("Sale not found.")

    # Check product exists
    product = (
        db.query(Product)
        .filter(
            Product.product_id == sale_item.product_id
        )
        .first()
    )

    if product is None:
        raise ValueError("Product not found.")

    # Validate quantity
    if sale_item.quantity <= 0:
        raise ValueError(
            "Quantity must be greater than zero."
        )

    # Validate unit price
    if sale_item.unit_price <= 0:
        raise ValueError(
            "Unit price must be greater than zero."
        )

    calculated_subtotal = (
        sale_item.quantity * sale_item.unit_price
    )

    if abs(
        calculated_subtotal - sale_item.subtotal
    ) > 0.01:
        raise ValueError(
            "Subtotal does not match quantity × unit price."
        )

    existing_item.product_id = sale_item.product_id
    existing_item.quantity = sale_item.quantity
    existing_item.unit_price = sale_item.unit_price
    existing_item.subtotal = calculated_subtotal

    try:
        db.commit()
        db.refresh(existing_item)

    except IntegrityError:
        db.rollback()
        raise ValueError(
            "Unable to update sale item because of a database constraint."
        )

    return existing_item


def delete_sale_item(
    db: Session,
    sale_item_id: int,
):
    existing_item = (
        db.query(SaleItem)
        .filter(
            SaleItem.sale_item_id == sale_item_id
        )
        .first()
    )

    if existing_item is None:
        return None

    try:
        db.delete(existing_item)
        db.commit()

    except IntegrityError:
        db.rollback()
        raise ValueError(
            "Unable to delete sale item because of a database constraint."
        )

    return existing_item