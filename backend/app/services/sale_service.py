from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.sale import Sale
from app.models.sale_item import SaleItem
from app.models.customer import Customer
from app.models.inventory import Inventory
from app.models.product import Product
from app.models.stock_transaction import StockTransaction

from app.schemas.sale import (
    SaleCreate,
    SaleWithItemsCreate,
)


# ==========================================================
# CREATE SALE
# Existing Sales CRUD
# ==========================================================

def create_sale(
    db: Session,
    sale: SaleCreate,
    user_id: int,
):
    # Check customer exists
    customer = (
        db.query(Customer)
        .filter(
            Customer.customer_id == sale.customer_id
        )
        .first()
    )

    if customer is None:
        raise ValueError(
            "Customer not found."
        )

    # Check duplicate invoice
    existing_sale = (
        db.query(Sale)
        .filter(
            Sale.invoice_number == sale.invoice_number
        )
        .first()
    )

    if existing_sale:
        raise ValueError(
            "Invoice number already exists."
        )

    new_sale = Sale(
        customer_id=sale.customer_id,
        user_id=user_id,
        invoice_number=sale.invoice_number,
        sale_date=sale.sale_date,
        total_amount=sale.total_amount,
        payment_method=sale.payment_method,
    )

    try:
        db.add(new_sale)
        db.commit()
        db.refresh(new_sale)

    except IntegrityError:
        db.rollback()

        raise ValueError(
            "Unable to create sale because of a database constraint."
        )

    return new_sale


# ==========================================================
# CREATE SALE WITH ITEMS
#
# Atomic operation:
#
# Sale
#   ↓
# Sale Items
#   ↓
# Inventory reduction
#   ↓
# Stock OUT transactions
#
# Everything commits together.
# If anything fails, everything rolls back.
# ==========================================================

def create_sale_with_items(
    db: Session,
    sale_data: SaleWithItemsCreate,
    user_id: int,
):
    # ------------------------------------------------------
    # Validate customer
    # ------------------------------------------------------

    customer = (
        db.query(Customer)
        .filter(
            Customer.customer_id == sale_data.customer_id
        )
        .first()
    )

    if customer is None:
        raise ValueError(
            "Customer not found."
        )

    # ------------------------------------------------------
    # Validate duplicate invoice
    # ------------------------------------------------------

    existing_sale = (
        db.query(Sale)
        .filter(
            Sale.invoice_number == sale_data.invoice_number
        )
        .first()
    )

    if existing_sale:
        raise ValueError(
            "Invoice number already exists."
        )

    # ------------------------------------------------------
    # Validate all products and inventory
    # BEFORE making any database changes
    # ------------------------------------------------------

    validated_items = []

    for item in sale_data.items:

        # Check product
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

        # Check inventory
        inventory = (
            db.query(Inventory)
            .filter(
                Inventory.product_id == item.product_id
            )
            .first()
        )

        if inventory is None:
            raise ValueError(
                f"Inventory record not found for product {item.product_id}."
            )

        # Check stock availability
        if inventory.quantity < item.quantity:
            raise ValueError(
                f"Insufficient stock for product {item.product_id}."
            )

        # Calculate subtotal on the server
        subtotal = (
            item.quantity * item.unit_price
        )

        validated_items.append(
            {
                "product_id": item.product_id,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "subtotal": subtotal,
                "inventory": inventory,
            }
        )

    # ------------------------------------------------------
    # Create Sale
    # ------------------------------------------------------

    new_sale = Sale(
        customer_id=sale_data.customer_id,
        user_id=user_id,
        invoice_number=sale_data.invoice_number,
        sale_date=sale_data.sale_date,
        total_amount=sale_data.total_amount,
        payment_method=sale_data.payment_method,
    )

    try:
        db.add(new_sale)

        # Get generated sale_id without committing
        db.flush()

        # --------------------------------------------------
        # Create Sale Items
        # Reduce Inventory
        # Create Stock OUT transactions
        # --------------------------------------------------

        for item in validated_items:

            # Create Sale Item
            sale_item = SaleItem(
                sale_id=new_sale.sale_id,
                product_id=item["product_id"],
                quantity=item["quantity"],
                unit_price=item["unit_price"],
                subtotal=item["subtotal"],
            )

            db.add(sale_item)

            # Reduce inventory
            inventory = item["inventory"]

            inventory.quantity -= item["quantity"]

            # Create stock OUT transaction
            stock_transaction = StockTransaction(
                product_id=item["product_id"],
                transaction_type="OUT",
                quantity=item["quantity"],
                transaction_date=sale_data.sale_date,
                reason=f"Sale {sale_data.invoice_number}",
            )

            db.add(stock_transaction)

        # --------------------------------------------------
        # Commit everything together
        # --------------------------------------------------

        db.commit()

        db.refresh(new_sale)

    except IntegrityError:
        db.rollback()

        raise ValueError(
            "Unable to create sale because of a database constraint."
        )

    except Exception:
        db.rollback()
        raise

    return new_sale


# ==========================================================
# GET ALL SALES
# ==========================================================

def get_all_sales(
    db: Session,
):
    return (
        db.query(Sale)
        .all()
    )


# ==========================================================
# GET SALE BY ID
# ==========================================================

def get_sale_by_id(
    db: Session,
    sale_id: int,
):
    return (
        db.query(Sale)
        .filter(
            Sale.sale_id == sale_id
        )
        .first()
    )


# ==========================================================
# UPDATE SALE
# ==========================================================

def update_sale(
    db: Session,
    sale_id: int,
    sale: SaleCreate,
):
    existing_sale = (
        db.query(Sale)
        .filter(
            Sale.sale_id == sale_id
        )
        .first()
    )

    if existing_sale is None:
        return None

    # Check customer exists
    customer = (
        db.query(Customer)
        .filter(
            Customer.customer_id == sale.customer_id
        )
        .first()
    )

    if customer is None:
        raise ValueError(
            "Customer not found."
        )

    # Check duplicate invoice
    duplicate_invoice = (
        db.query(Sale)
        .filter(
            Sale.invoice_number == sale.invoice_number,
            Sale.sale_id != sale_id,
        )
        .first()
    )

    if duplicate_invoice:
        raise ValueError(
            "Invoice number already exists."
        )

    existing_sale.customer_id = sale.customer_id
    existing_sale.invoice_number = sale.invoice_number
    existing_sale.sale_date = sale.sale_date
    existing_sale.total_amount = sale.total_amount
    existing_sale.payment_method = sale.payment_method

    try:
        db.commit()
        db.refresh(existing_sale)

    except IntegrityError:
        db.rollback()

        raise ValueError(
            "Unable to update sale because of a database constraint."
        )

    return existing_sale


# ==========================================================
# DELETE SALE
# ==========================================================

def delete_sale(
    db: Session,
    sale_id: int,
):
    existing_sale = (
        db.query(Sale)
        .filter(
            Sale.sale_id == sale_id
        )
        .first()
    )

    if existing_sale is None:
        return None

    try:
        db.delete(existing_sale)
        db.commit()

    except IntegrityError:
        db.rollback()

        raise ValueError(
            "Unable to delete sale because it is referenced by another record."
        )

    return existing_sale