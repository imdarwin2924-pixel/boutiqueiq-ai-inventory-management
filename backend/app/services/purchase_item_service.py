from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.purchase_item import PurchaseItem
from app.models.purchase_order import PurchaseOrder
from app.models.product import Product
from app.schemas.purchase_item import PurchaseItemCreate


def validate_purchase_item_references(
    db: Session,
    purchase_item: PurchaseItemCreate
):
    # Validate purchase order
    purchase_order = (
        db.query(PurchaseOrder)
        .filter(
            PurchaseOrder.purchase_order_id
            == purchase_item.purchase_order_id
        )
        .first()
    )

    if purchase_order is None:
        raise ValueError("Purchase order not found.")

    # Validate product
    product = (
        db.query(Product)
        .filter(
            Product.product_id
            == purchase_item.product_id
        )
        .first()
    )

    if product is None:
        raise ValueError("Product not found.")


def create_purchase_item(
    db: Session,
    purchase_item: PurchaseItemCreate
):
    # Validate foreign keys
    validate_purchase_item_references(
        db,
        purchase_item
    )

    # Validate quantity
    if purchase_item.quantity <= 0:
        raise ValueError(
            "Quantity must be greater than zero."
        )

    # Validate unit price
    if purchase_item.unit_price < 0:
        raise ValueError(
            "Unit price cannot be negative."
        )

    new_item = PurchaseItem(
        purchase_order_id=purchase_item.purchase_order_id,
        product_id=purchase_item.product_id,
        quantity=purchase_item.quantity,
        unit_price=purchase_item.unit_price,
        subtotal=purchase_item.subtotal,
    )

    try:
        db.add(new_item)
        db.commit()
        db.refresh(new_item)

    except IntegrityError:
        db.rollback()
        raise ValueError(
            "Unable to create purchase item because of a database constraint."
        )

    return new_item


def get_all_purchase_items(db: Session):
    return db.query(PurchaseItem).all()


def get_purchase_item_by_id(
    db: Session,
    purchase_item_id: int
):
    return (
        db.query(PurchaseItem)
        .filter(
            PurchaseItem.purchase_item_id
            == purchase_item_id
        )
        .first()
    )


def update_purchase_item(
    db: Session,
    purchase_item_id: int,
    purchase_item: PurchaseItemCreate
):
    existing_item = (
        db.query(PurchaseItem)
        .filter(
            PurchaseItem.purchase_item_id
            == purchase_item_id
        )
        .first()
    )

    if existing_item is None:
        return None

    # Validate foreign keys
    validate_purchase_item_references(
        db,
        purchase_item
    )

    # Validate quantity
    if purchase_item.quantity <= 0:
        raise ValueError(
            "Quantity must be greater than zero."
        )

    # Validate unit price
    if purchase_item.unit_price < 0:
        raise ValueError(
            "Unit price cannot be negative."
        )

    existing_item.purchase_order_id = (
        purchase_item.purchase_order_id
    )

    existing_item.product_id = (
        purchase_item.product_id
    )

    existing_item.quantity = (
        purchase_item.quantity
    )

    existing_item.unit_price = (
        purchase_item.unit_price
    )

    existing_item.subtotal = (
        purchase_item.subtotal
    )

    try:
        db.commit()
        db.refresh(existing_item)

    except IntegrityError:
        db.rollback()
        raise ValueError(
            "Unable to update purchase item because of a database constraint."
        )

    return existing_item


def delete_purchase_item(
    db: Session,
    purchase_item_id: int
):
    existing_item = (
        db.query(PurchaseItem)
        .filter(
            PurchaseItem.purchase_item_id
            == purchase_item_id
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
            "Unable to delete purchase item because of a database constraint."
        )

    return existing_item