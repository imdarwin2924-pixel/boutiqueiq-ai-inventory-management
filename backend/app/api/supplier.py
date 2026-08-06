from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.core.auth import get_current_user
from app.models.user import User

from app.schemas.supplier_schema import (
    SupplierCreate,
    SupplierUpdate,
)

from app.services.supplier_service import (
    create_supplier,
    get_all_suppliers,
    get_supplier_by_id,
    update_supplier,
    delete_supplier,
)

router = APIRouter()


@router.post("/")
def create_new_supplier(
    supplier: SupplierCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return create_supplier(db, supplier)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/")
def get_suppliers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_all_suppliers(db)


@router.get("/{supplier_id}")
def get_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    supplier = get_supplier_by_id(db, supplier_id)

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found."
        )

    return supplier


@router.put("/{supplier_id}")
def update_supplier_record(
    supplier_id: int,
    supplier: SupplierUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return update_supplier(db, supplier_id, supplier)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{supplier_id}")
def delete_supplier_record(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return delete_supplier(db, supplier_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))