from sqlalchemy.orm import Session

from app.models.sale import Sale
from app.schemas.sale import SaleCreate


def create_sale(db: Session, sale: SaleCreate):
    existing_sale = (
        db.query(Sale)
        .filter(Sale.invoice_number == sale.invoice_number)
        .first()
    )

    if existing_sale:
        return None

    new_sale = Sale(
        customer_id=sale.customer_id,
        user_id=sale.user_id,
        invoice_number=sale.invoice_number,
        sale_date=sale.sale_date,
        total_amount=sale.total_amount,
        payment_method=sale.payment_method,
    )

    db.add(new_sale)
    db.commit()
    db.refresh(new_sale)

    return new_sale


def get_all_sales(db: Session):
    return db.query(Sale).all()


def get_sale_by_id(db: Session, sale_id: int):
    return (
        db.query(Sale)
        .filter(Sale.sale_id == sale_id)
        .first()
    )
def update_sale(db: Session, sale_id: int, sale: SaleCreate):
    existing_sale = (
        db.query(Sale)
        .filter(Sale.sale_id == sale_id)
        .first()
    )

    if existing_sale is None:
        return None

    duplicate_invoice = (
        db.query(Sale)
        .filter(
            Sale.invoice_number == sale.invoice_number,
            Sale.sale_id != sale_id
        )
        .first()
    )

    if duplicate_invoice:
        return "duplicate"

    existing_sale.customer_id = sale.customer_id
    existing_sale.user_id = sale.user_id
    existing_sale.invoice_number = sale.invoice_number
    existing_sale.sale_date = sale.sale_date
    existing_sale.total_amount = sale.total_amount
    existing_sale.payment_method = sale.payment_method

    db.commit()
    db.refresh(existing_sale)

    return existing_sale


def delete_sale(db: Session, sale_id: int):
    existing_sale = (
        db.query(Sale)
        .filter(Sale.sale_id == sale_id)
        .first()
    )

    if existing_sale is None:
        return None

    db.delete(existing_sale)
    db.commit()

    return existing_sale