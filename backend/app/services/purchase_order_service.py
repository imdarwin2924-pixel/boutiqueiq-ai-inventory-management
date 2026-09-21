from math import isclose

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.purchase_order import PurchaseOrder
from app.models.purchase_item import PurchaseItem
from app.models.supplier import Supplier
from app.models.product import Product
from app.models.inventory import Inventory
from app.models.stock_transaction import StockTransaction

from app.schemas.purchase_order import (
    PurchaseOrderCreate,
    PurchaseWithItemsCreate,
)


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


def create_purchase_with_items(
    db: Session,
    purchase_data: PurchaseWithItemsCreate,
    user_id: int
):
    """
    Create a purchase order with purchase items and update inventory
    using stock-IN transactions as one atomic database operation.

    If any validation or database operation fails, the entire operation
    is rolled back.
    """

    # ---------------------------------------------------------
    # 1. Validate supplier
    # ---------------------------------------------------------
    supplier = (
        db.query(Supplier)
        .filter(
            Supplier.supplier_id == purchase_data.supplier_id
        )
        .first()
    )

    if supplier is None:
        raise ValueError("Supplier not found.")

    # ---------------------------------------------------------
    # 2. Check duplicate order number
    # ---------------------------------------------------------
    existing_order = (
        db.query(PurchaseOrder)
        .filter(
            PurchaseOrder.order_number
            == purchase_data.order_number
        )
        .first()
    )

    if existing_order:
        raise ValueError("Order number already exists.")

    # ---------------------------------------------------------
    # 3. Validate total amount
    # ---------------------------------------------------------
    calculated_total = sum(
        item.quantity * item.unit_price
        for item in purchase_data.items
    )

    if not isclose(
        calculated_total,
        purchase_data.total_amount,
        rel_tol=1e-9,
        abs_tol=0.01,
    ):
        raise ValueError(
            "Purchase total does not match the sum of purchase items."
        )

    # ---------------------------------------------------------
    # 4. Validate all products BEFORE changing the database
    # ---------------------------------------------------------
    validated_items = []

    for item in purchase_data.items:

        product = (
            db.query(Product)
            .filter(
                Product.product_id == item.product_id
            )
            .first()
        )

        if product is None:
            raise ValueError(
                f"Product {item.product_id} not found."
            )

        # Quantity and unit price are already constrained
        # by Pydantic, but keep service-level validation too.
        if item.quantity <= 0:
            raise ValueError(
                "Quantity must be greater than zero."
            )

        if item.unit_price <= 0:
            raise ValueError(
                "Unit price must be greater than zero."
            )

        subtotal = item.quantity * item.unit_price

        validated_items.append(
            {
                "product_id": item.product_id,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "subtotal": subtotal,
            }
        )

    try:
        # -----------------------------------------------------
        # 5. Create purchase order
        # -----------------------------------------------------
        new_order = PurchaseOrder(
            supplier_id=purchase_data.supplier_id,
            user_id=user_id,
            order_number=purchase_data.order_number,
            order_date=purchase_data.order_date,
            total_amount=purchase_data.total_amount,
            status=purchase_data.status,
        )

        db.add(new_order)

        # Generate purchase_order_id before creating items.
        db.flush()

        # -----------------------------------------------------
        # 6. Create purchase items
        # 7. Update inventory
        # 8. Create stock-IN transactions
        # -----------------------------------------------------
        for item in validated_items:

            # ---------------------------------------------
            # Create purchase item
            # ---------------------------------------------
            new_item = PurchaseItem(
                purchase_order_id=new_order.purchase_order_id,
                product_id=item["product_id"],
                quantity=item["quantity"],
                unit_price=item["unit_price"],
                subtotal=item["subtotal"],
            )

            db.add(new_item)

            # ---------------------------------------------
            # Find inventory
            # ---------------------------------------------
            inventory = (
                db.query(Inventory)
                .filter(
                    Inventory.product_id
                    == item["product_id"]
                )
                .first()
            )

            # ---------------------------------------------
            # Create inventory if it doesn't exist
            # ---------------------------------------------
            if inventory is None:
                inventory = Inventory(
                    product_id=item["product_id"],
                    quantity=0,
                    minimum_stock=5,
                    location=None,
                )

                db.add(inventory)
                db.flush()

            # ---------------------------------------------
            # Increase inventory
            # ---------------------------------------------
            inventory.quantity += item["quantity"]

            # ---------------------------------------------
            # Create STOCK IN transaction
            # ---------------------------------------------
            stock_transaction = StockTransaction(
                product_id=item["product_id"],
                transaction_type="IN",
                quantity=item["quantity"],
                transaction_date=purchase_data.order_date,
                reason=(
                    f"Purchase {purchase_data.order_number}"
                ),
            )

            db.add(stock_transaction)

        # -----------------------------------------------------
        # 9. Commit EVERYTHING together
        # -----------------------------------------------------
        db.commit()

        # Refresh purchase order after commit.
        db.refresh(new_order)

        return new_order

    except IntegrityError:
        db.rollback()

        raise ValueError(
            "Unable to create purchase because of a database constraint."
        )

    except Exception:
        db.rollback()
        raise


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