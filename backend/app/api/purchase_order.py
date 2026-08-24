from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.purchase_order import (
    PurchaseOrderCreate,
    PurchaseOrderResponse,
)
from app.services.purchase_order_service import (
    create_purchase_order,
    get_all_purchase_orders,
    get_purchase_order_by_id,
)

router = APIRouter(
    prefix="/purchase-orders",
    tags=["Purchase Orders"],
)
from app.services.purchase_order_service import (
    create_purchase_order,
    get_all_purchase_orders,
    get_purchase_order_by_id,
    update_purchase_order,
    delete_purchase_order,
)

@router.post(
    "/",
    response_model=PurchaseOrderResponse
)
def create_new_purchase_order(
    purchase_order: PurchaseOrderCreate,
    db: Session = Depends(get_db)
):
    new_order = create_purchase_order(
        db,
        purchase_order
    )

    if new_order is None:
        raise HTTPException(
            status_code=400,
            detail="Order number already exists"
        )

    return new_order


@router.get(
    "/",
    response_model=list[PurchaseOrderResponse]
)
def get_purchase_orders(
    db: Session = Depends(get_db)
):
    return get_all_purchase_orders(db)


@router.get(
    "/{purchase_order_id}",
    response_model=PurchaseOrderResponse
)
def get_purchase_order(
    purchase_order_id: int,
    db: Session = Depends(get_db)
):
    purchase_order = get_purchase_order_by_id(
        db,
        purchase_order_id
    )

    if purchase_order is None:
        raise HTTPException(
            status_code=404,
            detail="Purchase order not found"
        )

    return purchase_order
@router.put(
    "/{purchase_order_id}",
    response_model=PurchaseOrderResponse
)
def update_existing_purchase_order(
    purchase_order_id: int,
    purchase_order: PurchaseOrderCreate,
    db: Session = Depends(get_db)
):
    updated_order = update_purchase_order(
        db,
        purchase_order_id,
        purchase_order
    )

    if updated_order is None:
        raise HTTPException(
            status_code=404,
            detail="Purchase order not found"
        )

    return updated_order
@router.delete(
    "/{purchase_order_id}"
)
def delete_existing_purchase_order(
    purchase_order_id: int,
    db: Session = Depends(get_db)
):
    deleted_order = delete_purchase_order(
        db,
        purchase_order_id
    )

    if deleted_order is None:
        raise HTTPException(
            status_code=404,
            detail="Purchase order not found"
        )

    return {
        "message": "Purchase order deleted successfully"
    }