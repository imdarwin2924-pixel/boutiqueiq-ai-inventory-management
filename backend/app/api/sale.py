from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.sale import SaleCreate, SaleResponse
from app.services.sale_service import (
    create_sale,
    get_all_sales,
    get_sale_by_id,
)

router = APIRouter(
    prefix="/sales",
    tags=["Sales"],
)
from app.services.sale_service import (
    create_sale,
    get_all_sales,
    get_sale_by_id,
    update_sale,
    delete_sale,
)

@router.post(
    "/",
    response_model=SaleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_sale(
    sale: SaleCreate,
    db: Session = Depends(get_db),
):
    new_sale = create_sale(db, sale)

    if new_sale is None:
        raise HTTPException(
            status_code=400,
            detail="Invoice number already exists",
        )

    return new_sale


@router.get(
    "/",
    response_model=list[SaleResponse],
)
def get_sales(
    db: Session = Depends(get_db),
):
    return get_all_sales(db)


@router.get(
    "/{sale_id}",
    response_model=SaleResponse,
)
def get_single_sale(
    sale_id: int,
    db: Session = Depends(get_db),
):
    sale = get_sale_by_id(db, sale_id)

    if sale is None:
        raise HTTPException(
            status_code=404,
            detail="Sale not found",
        )

    return sale
@router.put(
    "/{sale_id}",
    response_model=SaleResponse,
)
def update_existing_sale(
    sale_id: int,
    sale: SaleCreate,
    db: Session = Depends(get_db),
):
    updated_sale = update_sale(db, sale_id, sale)

    if updated_sale is None:
        raise HTTPException(
            status_code=404,
            detail="Sale not found",
        )

    if updated_sale == "duplicate":
        raise HTTPException(
            status_code=400,
            detail="Invoice number already exists",
        )

    return updated_sale


@router.delete(
    "/{sale_id}",
)
def remove_sale(
    sale_id: int,
    db: Session = Depends(get_db),
):
    deleted_sale = delete_sale(db, sale_id)

    if deleted_sale is None:
        raise HTTPException(
            status_code=404,
            detail="Sale not found",
        )

    return {
        "message": "Sale deleted successfully",
        "sale_id": sale_id,
    }