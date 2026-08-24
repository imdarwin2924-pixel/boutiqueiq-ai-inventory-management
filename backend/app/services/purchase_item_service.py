from sqlalchemy.orm import Session

from app.models.purchase_item import PurchaseItem
from app.schemas.purchase_item import PurchaseItemCreate


def create_purchase_item(
    db: Session,
    purchase_item: PurchaseItemCreate
):
    new_item = PurchaseItem(
        purchase_order_id=purchase_item.purchase_order_id,
        product_id=purchase_item.product_id,
        quantity=purchase_item.quantity,
        unit_price=purchase_item.unit_price,
        subtotal=purchase_item.subtotal,
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

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

    existing_item.purchase_order_id = purchase_item.purchase_order_id
    existing_item.product_id = purchase_item.product_id
    existing_item.quantity = purchase_item.quantity
    existing_item.unit_price = purchase_item.unit_price
    existing_item.subtotal = purchase_item.subtotal

    db.commit()
    db.refresh(existing_item)

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

    db.delete(existing_item)
    db.commit()

    return existing_item