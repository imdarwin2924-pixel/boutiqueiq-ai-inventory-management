from sqlalchemy.orm import Session

from app.models.inventory import Inventory
from app.schemas.inventory_schema import (
    InventoryCreate,
    InventoryUpdate,
)


def create_inventory(db: Session, inventory: InventoryCreate):

    existing = (
        db.query(Inventory)
        .filter(Inventory.product_id == inventory.product_id)
        .first()
    )

    if existing:
        raise ValueError("Inventory already exists for this product.")

    new_inventory = Inventory(
        product_id=inventory.product_id,
        quantity=inventory.quantity,
        minimum_stock=inventory.minimum_stock,
        location=inventory.location,
    )

    db.add(new_inventory)
    db.commit()
    db.refresh(new_inventory)

    return new_inventory


def get_all_inventory(db: Session):
    return db.query(Inventory).all()


def get_inventory_by_id(db: Session, inventory_id: int):
    return (
        db.query(Inventory)
        .filter(Inventory.inventory_id == inventory_id)
        .first()
    )


def update_inventory(
    db: Session,
    inventory_id: int,
    inventory: InventoryUpdate,
):

    existing = get_inventory_by_id(db, inventory_id)

    if not existing:
        raise ValueError("Inventory record not found.")

    existing.product_id = inventory.product_id
    existing.quantity = inventory.quantity
    existing.minimum_stock = inventory.minimum_stock
    existing.location = inventory.location

    db.commit()
    db.refresh(existing)

    return existing


def delete_inventory(db: Session, inventory_id: int):

    inventory = get_inventory_by_id(db, inventory_id)

    if not inventory:
        raise ValueError("Inventory record not found.")

    db.delete(inventory)
    db.commit()

    return {"message": "Inventory deleted successfully."}