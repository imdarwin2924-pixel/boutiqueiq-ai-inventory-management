from fastapi import APIRouter, Depends, HTTPException, status
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
        message = str(e)

        if "already exists" in message:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=message,
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message,
        )


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
    supplier = get_supplier_by_id(
        db,
        supplier_id,
    )

    if not supplier:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Supplier not found.",
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
        return update_supplier(
            db,
            supplier_id,
            supplier,
        )

    except ValueError as e:
        message = str(e)

        if "Supplier not found" in message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message,
            )

        if "already exists" in message:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=message,
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message,
        )


@router.delete("/{supplier_id}")
def delete_supplier_record(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return delete_supplier(
            db,
            supplier_id,
        )

    except ValueError as e:
        message = str(e)

        if "Supplier not found" in message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message,
            )

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=message,
        )