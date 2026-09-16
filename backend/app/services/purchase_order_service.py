from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.purchase_order import PurchaseOrder
from app.models.supplier import Supplier
from app.schemas.purchase_order import PurchaseOrderCreate


def create_purchase_order(
    db: Session,
    purchase_order: PurchaseOrderCreate,
    user_id: int
):
    # Validate supplier
    supplier = (
        db.query(Supplier)
        .filter(
            Supplier.supplier_id == purchase_order.supplier_id
        )
        .first()
    )

    if supplier is None:
        raise ValueError("Supplier not found.")

    # Check duplicate order number
    existing_order = (
        db.query(PurchaseOrder)
        .filter(
            PurchaseOrder.order_number
            == purchase_order.order_number
        )
        .first()
    )

    if existing_order:
        raise ValueError("Order number already exists.")

    new_order = PurchaseOrder(
        supplier_id=purchase_order.supplier_id,
        user_id=user_id,
        order_number=purchase_order.order_number,
        order_date=purchase_order.order_date,
        total_amount=purchase_order.total_amount,
        status=purchase_order.status,
    )

    try:
        db.add(new_order)
        db.commit()
        db.refresh(new_order)

    except IntegrityError:
        db.rollback()
        raise ValueError(
            "Unable to create purchase order because of a database constraint."
        )

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

    # Validate supplier
    supplier = (
        db.query(Supplier)
        .filter(
            Supplier.supplier_id == purchase_order.supplier_id
        )
        .first()
    )

    if supplier is None:
        raise ValueError("Supplier not found.")

    # Check duplicate order number
    duplicate_order = (
        db.query(PurchaseOrder)
        .filter(
            PurchaseOrder.order_number
            == purchase_order.order_number,
            PurchaseOrder.purchase_order_id
            != purchase_order_id,
        )
        .first()
    )

    if duplicate_order:
        raise ValueError("Order number already exists.")

    # IMPORTANT:
    # Do NOT update user_id.
    # The original creator remains associated with the order.

    existing_order.supplier_id = purchase_order.supplier_id
    existing_order.order_number = purchase_order.order_number
    existing_order.order_date = purchase_order.order_date
    existing_order.total_amount = purchase_order.total_amount
    existing_order.status = purchase_order.status

    try:
        db.commit()
        db.refresh(existing_order)

    except IntegrityError:
        db.rollback()
        raise ValueError(
            "Unable to update purchase order because of a database constraint."
        )

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

    try:
        db.delete(existing_order)
        db.commit()

    except IntegrityError:
        db.rollback()
        raise ValueError(
            "Unable to delete purchase order because it is referenced by another record."
        )

    return existing_order