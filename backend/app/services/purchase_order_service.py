from sqlalchemy.orm import Session

from app.models.purchase_order import PurchaseOrder
from app.schemas.purchase_order import PurchaseOrderCreate


def create_purchase_order(
    db: Session,
    purchase_order: PurchaseOrderCreate
):
    existing_order = (
        db.query(PurchaseOrder)
        .filter(
            PurchaseOrder.order_number
            == purchase_order.order_number
        )
        .first()
    )

    if existing_order:
        return None

    new_order = PurchaseOrder(
        supplier_id=purchase_order.supplier_id,
        user_id=purchase_order.user_id,
        order_number=purchase_order.order_number,
        order_date=purchase_order.order_date,
        total_amount=purchase_order.total_amount,
        status=purchase_order.status,
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return new_order


def get_all_purchase_orders(db: Session):
    return db.query(PurchaseOrder).all()


def get_purchase_order_by_id(
    db: Session,
    purchase_order_id: int
):
    return (
        db.query(PurchaseOrder)
        .filter(
            PurchaseOrder.purchase_order_id
            == purchase_order_id
        )
        .first()
    )
def update_purchase_order(
    db: Session,
    purchase_order_id: int,
    purchase_order: PurchaseOrderCreate
):
    existing_order = (
        db.query(PurchaseOrder)
        .filter(
            PurchaseOrder.purchase_order_id
            == purchase_order_id
        )
        .first()
    )

    if existing_order is None:
        return None

    existing_order.supplier_id = purchase_order.supplier_id
    existing_order.user_id = purchase_order.user_id
    existing_order.order_number = purchase_order.order_number
    existing_order.order_date = purchase_order.order_date
    existing_order.total_amount = purchase_order.total_amount
    existing_order.status = purchase_order.status

    db.commit()
    db.refresh(existing_order)

    return existing_order


def delete_purchase_order(
    db: Session,
    purchase_order_id: int
):
    existing_order = (
        db.query(PurchaseOrder)
        .filter(
            PurchaseOrder.purchase_order_id
            == purchase_order_id
        )
        .first()
    )

    if existing_order is None:
        return None

    db.delete(existing_order)
    db.commit()

    return existing_order