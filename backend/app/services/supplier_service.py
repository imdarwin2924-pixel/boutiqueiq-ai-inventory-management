from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.supplier import Supplier
from app.schemas.supplier_schema import (
    SupplierCreate,
    SupplierUpdate,
)


def create_supplier(
    db: Session,
    supplier: SupplierCreate,
):
    existing = (
        db.query(Supplier)
        .filter(
            Supplier.email == supplier.email
        )
        .first()
    )

    if existing:
        raise ValueError(
            "Supplier with this email already exists."
        )

    new_supplier = Supplier(
        supplier_name=supplier.supplier_name,
        contact_person=supplier.contact_person,
        phone=supplier.phone,
        email=supplier.email,
        address=supplier.address,
    )

    try:
        db.add(new_supplier)
        db.commit()
        db.refresh(new_supplier)

    except IntegrityError:
        db.rollback()
        raise ValueError(
            "Unable to create supplier because of a database constraint."
        )

    return new_supplier


def get_all_suppliers(db: Session):
    return db.query(Supplier).all()


def get_supplier_by_id(
    db: Session,
    supplier_id: int,
):
    return (
        db.query(Supplier)
        .filter(
            Supplier.supplier_id == supplier_id
        )
        .first()
    )


def update_supplier(
    db: Session,
    supplier_id: int,
    supplier: SupplierUpdate,
):
    existing = get_supplier_by_id(
        db,
        supplier_id,
    )

    if not existing:
        raise ValueError(
            "Supplier not found."
        )

    duplicate = (
        db.query(Supplier)
        .filter(
            Supplier.email == supplier.email,
            Supplier.supplier_id != supplier_id,
        )
        .first()
    )

    if duplicate:
        raise ValueError(
            "Supplier with this email already exists."
        )

    existing.supplier_name = supplier.supplier_name
    existing.contact_person = supplier.contact_person
    existing.phone = supplier.phone
    existing.email = supplier.email
    existing.address = supplier.address

    try:
        db.commit()
        db.refresh(existing)

    except IntegrityError:
        db.rollback()
        raise ValueError(
            "Unable to update supplier because of a database constraint."
        )

    return existing


def delete_supplier(
    db: Session,
    supplier_id: int,
):
    supplier = get_supplier_by_id(
        db,
        supplier_id,
    )

    if not supplier:
        raise ValueError(
            "Supplier not found."
        )

    try:
        db.delete(supplier)
        db.commit()

    except IntegrityError:
        db.rollback()
        raise ValueError(
            "Cannot delete supplier because it is being used by another record."
        )

    return {
        "message": "Supplier deleted successfully."
    }