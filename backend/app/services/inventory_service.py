from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.inventory import Inventory
from app.models.product import Product

from app.schemas.inventory_schema import (
    InventoryCreate,
    InventoryUpdate,
)


def validate_product(
    db: Session,
    product_id: int,
):
    product = (
        db.query(Product)
        .filter(
            Product.product_id == product_id
        )
        .first()
    )

    if product is None:
        raise ValueError(
            "Product not found."
        )

    return product


def create_inventory(
    db: Session,
    inventory: InventoryCreate,
):
    # Validate product
    validate_product(
        db,
        inventory.product_id,
    )

    # One inventory record per product
    existing = (
        db.query(Inventory)
        .filter(
            Inventory.product_id == inventory.product_id
        )
        .first()
    )

    if existing:
        raise ValueError(
            "Inventory already exists for this product."
        )

    if inventory.quantity < 0:
        raise ValueError(
            "Quantity cannot be negative."
        )

    if inventory.minimum_stock < 0:
        raise ValueError(
            "Minimum stock cannot be negative."
        )

    new_inventory = Inventory(
        product_id=inventory.product_id,
        quantity=inventory.quantity,
        minimum_stock=inventory.minimum_stock,
        location=inventory.location,
    )

    try:
        db.add(new_inventory)
        db.commit()
        db.refresh(new_inventory)

    except IntegrityError:
        db.rollback()
        raise ValueError(
            "Unable to create inventory because of a database constraint."
        )

    return new_inventory


def get_all_inventory(
    db: Session,
):
    return db.query(Inventory).all()


def get_inventory_by_id(
    db: Session,
    inventory_id: int,
):
    return (
        db.query(Inventory)
        .filter(
            Inventory.inventory_id == inventory_id
        )
        .first()
    )


def update_inventory(
    db: Session,
    inventory_id: int,
    inventory: InventoryUpdate,
):
    existing = get_inventory_by_id(
        db,
        inventory_id,
    )

    if not existing:
        raise ValueError(
            "Inventory record not found."
        )

    # Validate new product
    validate_product(
        db,
        inventory.product_id,
    )

    # Prevent another inventory record
    # from using the same product
    duplicate = (
        db.query(Inventory)
        .filter(
            Inventory.product_id == inventory.product_id,
            Inventory.inventory_id != inventory_id,
        )
        .first()
    )

    if duplicate:
        raise ValueError(
            "Inventory already exists for this product."
        )

    if inventory.quantity < 0:
        raise ValueError(
            "Quantity cannot be negative."
        )

    if inventory.minimum_stock < 0:
        raise ValueError(
            "Minimum stock cannot be negative."
        )

    existing.product_id = inventory.product_id
    existing.quantity = inventory.quantity
    existing.minimum_stock = inventory.minimum_stock
    existing.location = inventory.location

    try:
        db.commit()
        db.refresh(existing)

    except IntegrityError:
        db.rollback()
        raise ValueError(
            "Unable to update inventory because of a database constraint."
        )

    return existing


def delete_inventory(
    db: Session,
    inventory_id: int,
):
    inventory = get_inventory_by_id(
        db,
        inventory_id,
    )

    if not inventory:
        raise ValueError(
            "Inventory record not found."
        )

    try:
        db.delete(inventory)
        db.commit()

    except IntegrityError:
        db.rollback()
        raise ValueError(
            "Cannot delete inventory because it is being used by another record."
        )

    return {
        "message": "Inventory deleted successfully."
    }