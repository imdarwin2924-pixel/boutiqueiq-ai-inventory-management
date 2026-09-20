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

from app.schemas.sale_item import (
    SaleItemCreate,
    SaleItemResponse,
)

from app.services.sale_item_service import (
    create_sale_item,
    get_all_sale_items,
    get_sale_item_by_id,
    get_sale_items_by_sale_id,
    update_sale_item,
    delete_sale_item,
)


router = APIRouter(
    prefix="/sale-items",
    tags=["Sale Items"],
)


# ==========================================================
# CREATE SALE ITEM
# ==========================================================

@router.post(
    "/{sale_id}",
    response_model=SaleItemResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_sale_item(
    sale_id: int,
    sale_item: SaleItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("Admin", "Manager", "Staff")
    ),
):
    try:
        return create_sale_item(
            db,
            sale_item,
            sale_id,
        )

    except ValueError as error:
        message = str(error)

        if (
            "Sale not found" in message
            or "Product not found" in message
        ):
            raise HTTPException(
                status_code=404,
                detail=message,
            )

        raise HTTPException(
            status_code=400,
            detail=message,
        )


# ==========================================================
# GET ALL SALE ITEMS
# ==========================================================

@router.get(
    "/",
    response_model=list[SaleItemResponse],
)
def get_sale_items(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_all_sale_items(db)


# ==========================================================
# GET SALE ITEMS FOR A SALE
# ==========================================================

@router.get(
    "/sale/{sale_id}",
    response_model=list[SaleItemResponse],
)
def get_items_for_sale(
    sale_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_sale_items_by_sale_id(
        db,
        sale_id,
    )


# ==========================================================
# GET SALE ITEM BY ID
# ==========================================================

@router.get(
    "/{sale_item_id}",
    response_model=SaleItemResponse,
)
def get_sale_item(
    sale_item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sale_item = get_sale_item_by_id(
        db,
        sale_item_id,
    )

    if sale_item is None:
        raise HTTPException(
            status_code=404,
            detail="Sale item not found.",
        )

    return sale_item


# ==========================================================
# UPDATE SALE ITEM
# ==========================================================

@router.put(
    "/{sale_item_id}",
    response_model=SaleItemResponse,
)
def update_existing_sale_item(
    sale_item_id: int,
    sale_item: SaleItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("Admin", "Manager")
    ),
):
    try:
        updated_item = update_sale_item(
            db,
            sale_item_id,
            sale_item,
        )

        if updated_item is None:
            raise HTTPException(
                status_code=404,
                detail="Sale item not found.",
            )

        return updated_item

    except ValueError as error:
        message = str(error)

        if (
            "Sale not found" in message
            or "Product not found" in message
        ):
            raise HTTPException(
                status_code=404,
                detail=message,
            )

        raise HTTPException(
            status_code=400,
            detail=message,
        )


# ==========================================================
# DELETE SALE ITEM
# ==========================================================

@router.delete(
    "/{sale_item_id}",
)
def delete_existing_sale_item(
    sale_item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("Admin", "Manager")
    ),
):
    try:
        deleted_item = delete_sale_item(
            db,
            sale_item_id,
        )

        if deleted_item is None:
            raise HTTPException(
                status_code=404,
                detail="Sale item not found.",
            )

        return {
            "message": "Sale item deleted successfully.",
            "sale_item_id": sale_item_id,
        }

    except ValueError as error:
        raise HTTPException(
            status_code=409,
            detail=str(error),
        )