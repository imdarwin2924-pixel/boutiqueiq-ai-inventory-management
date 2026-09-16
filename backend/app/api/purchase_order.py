from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.core.auth import get_current_user
from app.models.user import User

from app.schemas.purchase_order import (
    PurchaseOrderCreate,
    PurchaseOrderResponse,
)

from app.services.purchase_order_service import (
    create_purchase_order,
    get_all_purchase_orders,
    get_purchase_order_by_id,
    update_purchase_order,
    delete_purchase_order,
)


router = APIRouter(
    prefix="/purchase-orders",
    tags=["Purchase Orders"],
)


@router.post(
    "/",
    response_model=PurchaseOrderResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_purchase_order(
    purchase_order: PurchaseOrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return create_purchase_order(
            db,
            purchase_order,
            current_user.user_id,
        )

    except ValueError as e:
        message = str(e)

        if "Order number already exists" in message:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=message,
            )

        if "Supplier not found" in message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message,
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message,
        )


@router.get(
    "/",
    response_model=list[PurchaseOrderResponse],
)
def get_purchase_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_all_purchase_orders(db)


@router.get(
    "/{purchase_order_id}",
    response_model=PurchaseOrderResponse,
)
def get_purchase_order(
    purchase_order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    purchase_order = get_purchase_order_by_id(
        db,
        purchase_order_id,
    )

    if purchase_order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Purchase order not found",
        )

    return purchase_order


@router.put(
    "/{purchase_order_id}",
    response_model=PurchaseOrderResponse,
)
def update_existing_purchase_order(
    purchase_order_id: int,
    purchase_order: PurchaseOrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        updated_order = update_purchase_order(
            db,
            purchase_order_id,
            purchase_order,
        )

        if updated_order is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Purchase order not found",
            )

        return updated_order

    except ValueError as e:
        message = str(e)

        if "Order number already exists" in message:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=message,
            )

        if "Supplier not found" in message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message,
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message,
        )


@router.delete(
    "/{purchase_order_id}",
)
def delete_existing_purchase_order(
    purchase_order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        deleted_order = delete_purchase_order(
            db,
            purchase_order_id,
        )

        if deleted_order is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Purchase order not found",
            )

        return {
            "message": "Purchase order deleted successfully",
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )