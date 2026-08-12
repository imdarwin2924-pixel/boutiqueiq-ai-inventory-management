from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.schemas.customer_schema import (
    CustomerCreate,
    CustomerUpdate,
)


def create_customer(db: Session, customer: CustomerCreate):

    existing = (
        db.query(Customer)
        .filter(Customer.email == customer.email)
        .first()
    )

    if existing:
        raise ValueError("Customer with this email already exists.")

    new_customer = Customer(
        customer_name=customer.customer_name,
        phone=customer.phone,
        email=customer.email,
        address=customer.address,
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return new_customer


def get_all_customers(db: Session):
    return db.query(Customer).all()


def get_customer_by_id(db: Session, customer_id: int):
    return (
        db.query(Customer)
        .filter(Customer.customer_id == customer_id)
        .first()
    )


def update_customer(
    db: Session,
    customer_id: int,
    customer: CustomerUpdate,
):

    existing = get_customer_by_id(db, customer_id)

    if not existing:
        raise ValueError("Customer not found.")

    existing.customer_name = customer.customer_name
    existing.phone = customer.phone
    existing.email = customer.email
    existing.address = customer.address

    db.commit()
    db.refresh(existing)

    return existing


def delete_customer(db: Session, customer_id: int):

    customer = get_customer_by_id(db, customer_id)

    if not customer:
        raise ValueError("Customer not found.")

    db.delete(customer)
    db.commit()

    return {"message": "Customer deleted successfully."}