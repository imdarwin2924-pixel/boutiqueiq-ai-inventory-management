from datetime import datetime

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.stock_transaction import StockTransaction
from app.models.inventory import Inventory
from app.models.product import Product

from app.schemas.stock_transaction import StockTransactionCreate


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


def get_inventory_for_product(
    db: Session,
    product_id: int,
):
    return (
        db.query(Inventory)
        .filter(
            Inventory.product_id == product_id
        )
        .first()
    )


def validate_transaction(
    transaction: StockTransactionCreate,
):
    transaction_type = (
        transaction.transaction_type
        .strip()
        .upper()
    )

    if transaction_type not in ("IN", "OUT"):
        raise ValueError(
            "Transaction type must be IN or OUT."
        )

    if transaction.quantity <= 0:
        raise ValueError(
            "Quantity must be greater than zero."
        )

    if not transaction.reason.strip():
        raise ValueError(
            "Reason cannot be empty."
        )

    return transaction_type


def create_stock_transaction(
    db: Session,
    transaction: StockTransactionCreate,
):
    # --------------------------------------------------
    # 1. Validate transaction data
    # --------------------------------------------------

    transaction_type = validate_transaction(
        transaction
    )

    # --------------------------------------------------
    # 2. Validate product
    # --------------------------------------------------

    validate_product(
        db,
        transaction.product_id,
    )

    # --------------------------------------------------
    # 3. Get inventory
    # --------------------------------------------------

    inventory = get_inventory_for_product(
        db,
        transaction.product_id,
    )

    # --------------------------------------------------
    # 4. STOCK IN
    # --------------------------------------------------

    if transaction_type == "IN":

        if inventory is None:
            inventory = Inventory(
                product_id=transaction.product_id,
                quantity=transaction.quantity,
                minimum_stock=5,
                location=None,
            )

            db.add(inventory)

        else:
            inventory.quantity += (
                transaction.quantity
            )

    # --------------------------------------------------
    # 5. STOCK OUT
    # --------------------------------------------------

    elif transaction_type == "OUT":

        if inventory is None:
            raise ValueError(
                "Inventory record not found."
            )

        if (
            inventory.quantity
            < transaction.quantity
        ):
            raise ValueError(
                "Insufficient stock."
            )

        inventory.quantity -= (
            transaction.quantity
        )

    # --------------------------------------------------
    # 6. Create transaction record
    # --------------------------------------------------

    new_transaction = StockTransaction(
        product_id=transaction.product_id,
        transaction_type=transaction_type,
        quantity=transaction.quantity,
        transaction_date=transaction.transaction_date,
        reason=transaction.reason.strip(),
    )

    try:
        db.add(new_transaction)

        # Inventory update and transaction
        # creation happen atomically.
        db.commit()

        db.refresh(new_transaction)

    except IntegrityError:
        db.rollback()

        raise ValueError(
            "Unable to create stock transaction because of a database constraint."
        )

    return new_transaction


def get_all_stock_transactions(
    db: Session,
    product_id: int | None = None,
    transaction_type: str | None = None,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
):
    # --------------------------------------------------
    # Base query
    # --------------------------------------------------

    query = db.query(
        StockTransaction
    )

    # --------------------------------------------------
    # Product filter
    # --------------------------------------------------

    if product_id is not None:
        query = query.filter(
            StockTransaction.product_id
            == product_id
        )

    # --------------------------------------------------
    # Transaction type filter
    # --------------------------------------------------

    if transaction_type is not None:

        normalized_type = (
            transaction_type
            .strip()
            .upper()
        )

        if normalized_type not in (
            "IN",
            "OUT",
        ):
            raise ValueError(
                "Transaction type filter must be IN or OUT."
            )

        query = query.filter(
            StockTransaction.transaction_type
            == normalized_type
        )

    # --------------------------------------------------
    # Start date filter
    # --------------------------------------------------

    if start_date is not None:
        query = query.filter(
            StockTransaction.transaction_date
            >= start_date
        )

    # --------------------------------------------------
    # End date filter
    # --------------------------------------------------

    if end_date is not None:
        query = query.filter(
            StockTransaction.transaction_date
            <= end_date
        )

    # --------------------------------------------------
    # Newest transactions first
    # --------------------------------------------------

    return (
        query
        .order_by(
            StockTransaction.transaction_date.desc(),
            StockTransaction.transaction_id.desc(),
        )
        .all()
    )


def get_stock_transaction_by_id(
    db: Session,
    transaction_id: int,
):
    return (
        db.query(StockTransaction)
        .filter(
            StockTransaction.transaction_id
            == transaction_id
        )
        .first()
    )


def update_stock_transaction(
    db: Session,
    transaction_id: int,
    transaction: StockTransactionCreate,
):
    existing_transaction = (
        db.query(StockTransaction)
        .filter(
            StockTransaction.transaction_id
            == transaction_id
        )
        .first()
    )

    if existing_transaction is None:
        return None

    # Validate the new transaction data.
    transaction_type = validate_transaction(
        transaction
    )

    # Validate the product.
    validate_product(
        db,
        transaction.product_id,
    )

    # --------------------------------------------------
    # IMPORTANT:
    # Do not modify inventory here.
    #
    # Existing transactions may already have affected
    # inventory. Editing the transaction directly could
    # make inventory totals inconsistent.
    #
    # Inventory changes are performed through POST.
    # --------------------------------------------------

    existing_transaction.product_id = (
        transaction.product_id
    )

    existing_transaction.transaction_type = (
        transaction_type
    )

    existing_transaction.quantity = (
        transaction.quantity
    )

    existing_transaction.transaction_date = (
        transaction.transaction_date
    )

    existing_transaction.reason = (
        transaction.reason.strip()
    )

    try:
        db.commit()
        db.refresh(existing_transaction)

    except IntegrityError:
        db.rollback()

        raise ValueError(
            "Unable to update stock transaction because of a database constraint."
        )

    return existing_transaction


def delete_stock_transaction(
    db: Session,
    transaction_id: int,
):
    existing_transaction = (
        db.query(StockTransaction)
        .filter(
            StockTransaction.transaction_id
            == transaction_id
        )
        .first()
    )

    if existing_transaction is None:
        return None

    try:
        db.delete(existing_transaction)
        db.commit()

    except IntegrityError:
        db.rollback()

        raise ValueError(
            "Cannot delete stock transaction because of a database constraint."
        )

    return existing_transaction 