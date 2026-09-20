from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.inventory import Inventory
from app.models.product import Product

from app.schemas.inventory_schema import (
    InventoryCreate,
    InventoryUpdate,
)


# ==========================================================
# PRODUCT VALIDATION
# ==========================================================

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


# ==========================================================
# CREATE INVENTORY
# ==========================================================

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
            Inventory.product_id
            == inventory.product_id
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


# ==========================================================
# GET ALL INVENTORY
# ==========================================================

def get_all_inventory(
    db: Session,
):
    return (
        db.query(Inventory)
        .all()
    )


# ==========================================================
# GET INVENTORY BY ID
# ==========================================================

def get_inventory_by_id(
    db: Session,
    inventory_id: int,
):
    return (
        db.query(Inventory)
        .filter(
            Inventory.inventory_id
            == inventory_id
        )
        .first()
    )


# ==========================================================
# UPDATE INVENTORY
# ==========================================================

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
            Inventory.product_id
            == inventory.product_id,
            Inventory.inventory_id
            != inventory_id,
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

    existing.product_id = (
        inventory.product_id
    )

    existing.quantity = (
        inventory.quantity
    )

    existing.minimum_stock = (
        inventory.minimum_stock
    )

    existing.location = (
        inventory.location
    )

    try:
        db.commit()
        db.refresh(existing)

    except IntegrityError:
        db.rollback()

        raise ValueError(
            "Unable to update inventory because of a database constraint."
        )

    return existing


# ==========================================================
# DELETE INVENTORY
# ==========================================================

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


# ==========================================================
# STOCK STATUS
# ==========================================================

def get_inventory_status(
    inventory: Inventory,
) -> str:
    """
    Determine the current stock status.

    Rules:
        quantity == 0
            -> OUT_OF_STOCK

        quantity <= minimum_stock
            -> LOW_STOCK

        quantity > minimum_stock
            -> IN_STOCK
    """

    if inventory.quantity == 0:
        return "OUT_OF_STOCK"

    if (
        inventory.quantity
        <= inventory.minimum_stock
    ):
        return "LOW_STOCK"

    return "IN_STOCK"


# ==========================================================
# BUILD STATUS RESPONSE
# ==========================================================

def build_inventory_status(
    inventory: Inventory,
):
    return {
        "inventory_id": inventory.inventory_id,
        "product_id": inventory.product_id,
        "quantity": inventory.quantity,
        "minimum_stock": inventory.minimum_stock,
        "location": inventory.location,
        "last_updated": inventory.last_updated,
        "status": get_inventory_status(
            inventory
        ),
    }


# ==========================================================
# GET INVENTORY BY STATUS
# ==========================================================

def get_inventory_by_status(
    db: Session,
    status: str,
):
    inventories = (
        db.query(Inventory)
        .all()
    )

    normalized_status = (
        status
        .strip()
        .upper()
    )

    valid_statuses = {
        "IN_STOCK",
        "LOW_STOCK",
        "OUT_OF_STOCK",
    }

    if normalized_status not in valid_statuses:
        raise ValueError(
            "Invalid inventory status."
        )

    return [
        build_inventory_status(
            inventory
        )
        for inventory in inventories
        if get_inventory_status(
            inventory
        ) == normalized_status
    ]


# ==========================================================
# GET INVENTORY STATUS SUMMARY
# ==========================================================

def get_inventory_status_summary(
    db: Session,
):
    inventories = (
        db.query(Inventory)
        .all()
    )

    in_stock = 0
    low_stock = 0
    out_of_stock = 0

    for inventory in inventories:
        status = get_inventory_status(
            inventory
        )

        if status == "IN_STOCK":
            in_stock += 1

        elif status == "LOW_STOCK":
            low_stock += 1

        elif status == "OUT_OF_STOCK":
            out_of_stock += 1

    return {
        "total_inventory": len(
            inventories
        ),
        "in_stock": in_stock,
        "low_stock": low_stock,
        "out_of_stock": out_of_stock,
    }