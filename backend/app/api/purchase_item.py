from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.purchase_item import (
    PurchaseItemCreate,
    PurchaseItemResponse,
)
from app.services.purchase_item_service import (
    create_purchase_item,
    get_all_purchase_items,
    get_purchase_item_by_id,
)

router = APIRouter(
    prefix="/purchase-items",
    tags=["Purchase Items"],
)
from app.services.purchase_item_service import (
    create_purchase_item,
    get_all_purchase_items,
    get_purchase_item_by_id,
    update_purchase_item,
    delete_purchase_item,
)

@router.post(
    "/",
    response_model=PurchaseItemResponse
)
def create_new_purchase_item(
    purchase_item: PurchaseItemCreate,
    db: Session = Depends(get_db)
):
    return create_purchase_item(
        db,
        purchase_item
    )


@router.get(
    "/",
    response_model=list[PurchaseItemResponse]
)
def get_purchase_items(
    db: Session = Depends(get_db)
):
    return get_all_purchase_items(db)


@router.get(
    "/{purchase_item_id}",
    response_model=PurchaseItemResponse
)
def get_purchase_item(
    purchase_item_id: int,
    db: Session = Depends(get_db)
):
    purchase_item = get_purchase_item_by_id(
        db,
        purchase_item_id
    )

    if purchase_item is None:
        raise HTTPException(
            status_code=404,
            detail="Purchase item not found"
        )

    return purchase_item
@router.put(
    "/{purchase_item_id}",
    response_model=PurchaseItemResponse
)
def update_existing_purchase_item(
    purchase_item_id: int,
    purchase_item: PurchaseItemCreate,
    db: Session = Depends(get_db)
):
    updated_item = update_purchase_item(
        db,
        purchase_item_id,
        purchase_item
    )

    if updated_item is None:
        raise HTTPException(
            status_code=404,
            detail="Purchase item not found"
        )

    return updated_item
@router.delete(
    "/{purchase_item_id}"
)
def delete_existing_purchase_item(
    purchase_item_id: int,
    db: Session = Depends(get_db)
):
    deleted_item = delete_purchase_item(
        db,
        purchase_item_id
    )

    if deleted_item is None:
        raise HTTPException(
            status_code=404,
            detail="Purchase item not found"
        )

    return {
        "message": "Purchase item deleted successfully"
    }