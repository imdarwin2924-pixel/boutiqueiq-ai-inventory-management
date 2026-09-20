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

from app.schemas.sale import (
    SaleCreate,
    SaleWithItemsCreate,
    SaleResponse,
)

from app.services.sale_service import (
    create_sale,
    create_sale_with_items,
    get_all_sales,
    get_sale_by_id,
    update_sale,
    delete_sale,
)


router = APIRouter(
    prefix="/sales",
    tags=["Sales"],
)


# ==========================================================
# CREATE SALE
# Admin + Manager + Staff
#
# Existing endpoint preserved for Phase 3 compatibility.
# ==========================================================

@router.post(
    "/",
    response_model=SaleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_sale(
    sale: SaleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    try:
        new_sale = create_sale(
            db,
            sale,
            current_user.user_id,
        )

    except ValueError as error:
        message = str(error)

        if "Customer not found" in message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message,
            )

        if "Invoice number already exists" in message:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=message,
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message,
        )

    return new_sale


# ==========================================================
# CREATE SALE WITH ITEMS
#
# Atomic business operation:
#
# Sale
#   ↓
# Sale Items
#   ↓
# Inventory reduction
#   ↓
# Stock OUT transactions
#
# Admin + Manager + Staff
# ==========================================================

@router.post(
    "/with-items",
    response_model=SaleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_sale_with_items(
    sale: SaleWithItemsCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    try:
        new_sale = create_sale_with_items(
            db,
            sale,
            current_user.user_id,
        )

    except ValueError as error:
        message = str(error)

        if (
            "Customer not found" in message
            or "Product" in message
            and "not found" in message
            or "Inventory record not found" in message
        ):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message,
            )

        if (
            "Invoice number already exists" in message
            or "Insufficient stock" in message
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=message,
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message,
        )

    return new_sale


# ==========================================================
# GET ALL SALES
# All authenticated users
# ==========================================================

@router.get(
    "/",
    response_model=list[SaleResponse],
)
def get_sales(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    return get_all_sales(db)


# ==========================================================
# GET SALE BY ID
# All authenticated users
# ==========================================================

@router.get(
    "/{sale_id}",
    response_model=SaleResponse,
)
def get_single_sale(
    sale_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    sale = get_sale_by_id(
        db,
        sale_id,
    )

    if sale is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sale not found",
        )

    return sale


# ==========================================================
# UPDATE SALE
# Admin + Manager only
# ==========================================================

@router.put(
    "/{sale_id}",
    response_model=SaleResponse,
)
def update_existing_sale(
    sale_id: int,
    sale: SaleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("Admin", "Manager")
    ),
):
    try:
        updated_sale = update_sale(
            db,
            sale_id,
            sale,
        )

    except ValueError as error:
        message = str(error)

        if "Customer not found" in message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message,
            )

        if "Invoice number already exists" in message:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=message,
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message,
        )

    if updated_sale is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sale not found",
        )

    return updated_sale


# ==========================================================
# DELETE SALE
# Admin + Manager only
# ==========================================================

@router.delete(
    "/{sale_id}",
)
def remove_sale(
    sale_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("Admin", "Manager")
    ),
):
    try:
        deleted_sale = delete_sale(
            db,
            sale_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        )

    if deleted_sale is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sale not found",
        )

    return {
        "message": "Sale deleted successfully",
        "sale_id": sale_id,
    }