from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.sale import Sale
from app.models.customer import Customer
from app.schemas.sale import SaleCreate


def create_sale(
    db: Session,
    sale: SaleCreate,
    user_id: int,
):
    # Check customer exists
    customer = (
        db.query(Customer)
        .filter(Customer.customer_id == sale.customer_id)
        .first()
    )

    if customer is None:
        raise ValueError("Customer not found.")

    # Check duplicate invoice
    existing_sale = (
        db.query(Sale)
        .filter(Sale.invoice_number == sale.invoice_number)
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


def get_all_sales(db: Session):
    return db.query(Sale).all()


def get_sale_by_id(
    db: Session,
    sale_id: int,
):
    return (
        db.query(Sale)
        .filter(Sale.sale_id == sale_id)
        .first()
    )


def update_sale(
    db: Session,
    sale_id: int,
    sale: SaleCreate,
):
    existing_sale = (
        db.query(Sale)
        .filter(Sale.sale_id == sale_id)
        .first()
    )

    if existing_sale is None:
        return None

    # Check customer exists
    customer = (
        db.query(Customer)
        .filter(Customer.customer_id == sale.customer_id)
        .first()
    )

    if customer is None:
        raise ValueError("Customer not found.")

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


def delete_sale(
    db: Session,
    sale_id: int,
):
    existing_sale = (
        db.query(Sale)
        .filter(Sale.sale_id == sale_id)
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