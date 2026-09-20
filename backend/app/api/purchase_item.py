from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.core.auth import (
    get_current_user,
    require_roles,
)

from app.models.user import User

from app.schemas.purchase_item import (
    PurchaseItemCreate,
    PurchaseItemResponse,
)

from app.services.purchase_item_service import (
    create_purchase_item,
    get_all_purchase_items,
    get_purchase_item_by_id,
    update_purchase_item,
    delete_purchase_item,
)


router = APIRouter(
    prefix="/purchase-items",
    tags=["Purchase Items"],
)


# ==========================================================
# CREATE PURCHASE ITEM
# Admin + Manager only
# ==========================================================

@router.post(
    "/",
    response_model=PurchaseItemResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_purchase_item(
    purchase_item: PurchaseItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("Admin", "Manager")
    ),
):
    try:
        return create_purchase_item(
            db,
            purchase_item,
        )

    except ValueError as e:
        message = str(e)

        if "Purchase order not found" in message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message,
            )

        if "Product not found" in message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message,
            )

        if "Quantity" in message:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message,
            )

        if "Unit price" in message:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message,
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message,
        )


# ==========================================================
# GET ALL PURCHASE ITEMS
# All authenticated users
# ==========================================================

@router.get(
    "/",
    response_model=list[PurchaseItemResponse],
)
def get_purchase_items(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    return get_all_purchase_items(db)


# ==========================================================
# GET PURCHASE ITEM BY ID
# All authenticated users
# ==========================================================

@router.get(
    "/{purchase_item_id}",
    response_model=PurchaseItemResponse,
)
def get_purchase_item(
    purchase_item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    purchase_item = get_purchase_item_by_id(
        db,
        purchase_item_id,
    )

    if purchase_item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Purchase item not found",
        )

    return purchase_item


# ==========================================================
# UPDATE PURCHASE ITEM
# Admin + Manager only
# ==========================================================

@router.put(
    "/{purchase_item_id}",
    response_model=PurchaseItemResponse,
)
def update_existing_purchase_item(
    purchase_item_id: int,
    purchase_item: PurchaseItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("Admin", "Manager")
    ),
):
    try:
        updated_item = update_purchase_item(
            db,
            purchase_item_id,
            purchase_item,
        )

        if updated_item is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Purchase item not found",
            )

        return updated_item

    except ValueError as e:
        message = str(e)

        if "Purchase order not found" in message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message,
            )

        if "Product not found" in message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message,
            )

        if "Quantity" in message:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message,
            )

        if "Unit price" in message:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message,
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message,
        )


# ==========================================================
# DELETE PURCHASE ITEM
# Admin + Manager only
# ==========================================================

@router.delete(
    "/{purchase_item_id}",
)
def delete_existing_purchase_item(
    purchase_item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("Admin", "Manager")
    ),
):
    try:
        deleted_item = delete_purchase_item(
            db,
            purchase_item_id,
        )

        if deleted_item is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Purchase item not found",
            )

        return {
            "message": "Purchase item deleted successfully",
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )