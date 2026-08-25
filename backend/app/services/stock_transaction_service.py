from sqlalchemy.orm import Session

from app.models.stock_transaction import StockTransaction
from app.schemas.stock_transaction import StockTransactionCreate
from app.models.inventory import Inventory

def create_stock_transaction(
    db: Session,
    transaction: StockTransactionCreate
):
    new_transaction = StockTransaction(
        product_id=transaction.product_id,
        transaction_type=transaction.transaction_type,
        quantity=transaction.quantity,
        transaction_date=transaction.transaction_date,
        reason=transaction.reason,
    )

    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)

    return new_transaction


def get_all_stock_transactions(db: Session):
    return (
        db.query(StockTransaction)
        .order_by(StockTransaction.transaction_id)
        .all()
    )


def get_stock_transaction_by_id(
    db: Session,
    transaction_id: int
):
    return (
        db.query(StockTransaction)
        .filter(
            StockTransaction.transaction_id == transaction_id
        )
        .first()
    )


def update_stock_transaction(
    db: Session,
    transaction_id: int,
    transaction: StockTransactionCreate
):
    existing_transaction = (
        db.query(StockTransaction)
        .filter(
            StockTransaction.transaction_id == transaction_id
        )
        .first()
    )

    if existing_transaction is None:
        return None

    existing_transaction.product_id = transaction.product_id
    existing_transaction.transaction_type = transaction.transaction_type
    existing_transaction.quantity = transaction.quantity
    existing_transaction.transaction_date = transaction.transaction_date
    existing_transaction.reason = transaction.reason

    db.commit()
    db.refresh(existing_transaction)

    return existing_transaction


def delete_stock_transaction(
    db: Session,
    transaction_id: int
):
    existing_transaction = (
        db.query(StockTransaction)
        .filter(
            StockTransaction.transaction_id == transaction_id
        )
        .first()
    )

    if existing_transaction is None:
        return None

    db.delete(existing_transaction)
    db.commit()

    return existing_transaction
def create_stock_transaction(
    db: Session,
    transaction: StockTransactionCreate
):
    inventory = (
        db.query(Inventory)
        .filter(
            Inventory.product_id == transaction.product_id
        )
        .first()
    )

    if transaction.transaction_type == "IN":
        if inventory is None:
            inventory = Inventory(
                product_id=transaction.product_id,
                quantity=transaction.quantity,
            )

            db.add(inventory)
        else:
            inventory.quantity += transaction.quantity

    elif transaction.transaction_type == "OUT":
        if inventory is None:
            raise ValueError(
                "Inventory record not found"
            )

        if inventory.quantity < transaction.quantity:
            raise ValueError(
                "Insufficient stock"
            )

        inventory.quantity -= transaction.quantity

    else:
        raise ValueError(
            "Transaction type must be IN or OUT"
        )

    new_transaction = StockTransaction(
        product_id=transaction.product_id,
        transaction_type=transaction.transaction_type,
        quantity=transaction.quantity,
        transaction_date=transaction.transaction_date,
        reason=transaction.reason,
    )

    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)

    return new_transaction