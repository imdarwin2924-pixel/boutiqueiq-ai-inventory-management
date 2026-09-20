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

from app.schemas.inventory_schema import (
    InventoryCreate,
    InventoryUpdate,
    InventoryStatusResponse,
)

from app.services.inventory_service import (
    create_inventory,
    get_all_inventory,
    get_inventory_by_id,
    update_inventory,
    delete_inventory,
    get_inventory_by_status,
    get_inventory_status_summary,
)


router = APIRouter()


# ==========================================================
# CREATE INVENTORY
# Admin + Manager only
# ==========================================================

@router.post("/")
def create_new_inventory(
    inventory: InventoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("Admin", "Manager")
    ),
):
    try:
        return create_inventory(
            db,
            inventory,
        )

    except ValueError as e:
        message = str(e)

        if "Product not found" in message:
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


# ==========================================================
# GET ALL INVENTORY
# All authenticated users
# ==========================================================

@router.get("/")
def get_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    return get_all_inventory(db)


# ==========================================================
# STATUS SUMMARY
# All authenticated users
#
# IMPORTANT:
# This must appear BEFORE /{inventory_id}
# ==========================================================

@router.get("/status/summary")
def get_inventory_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    return get_inventory_status_summary(
        db
    )


# ==========================================================
# LOW STOCK
# All authenticated users
# ==========================================================

@router.get(
    "/status/low-stock",
    response_model=list[
        InventoryStatusResponse
    ],
)
def get_low_stock_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    return get_inventory_by_status(
        db,
        "LOW_STOCK",
    )


# ==========================================================
# OUT OF STOCK
# All authenticated users
# ==========================================================

@router.get(
    "/status/out-of-stock",
    response_model=list[
        InventoryStatusResponse
    ],
)
def get_out_of_stock_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    return get_inventory_by_status(
        db,
        "OUT_OF_STOCK",
    )


# ==========================================================
# IN STOCK
# All authenticated users
# ==========================================================

@router.get(
    "/status/in-stock",
    response_model=list[
        InventoryStatusResponse
    ],
)
def get_in_stock_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    return get_inventory_by_status(
        db,
        "IN_STOCK",
    )


# ==========================================================
# GET INVENTORY BY ID
# All authenticated users
# ==========================================================

@router.get("/{inventory_id}")
def get_inventory_record(
    inventory_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    inventory = get_inventory_by_id(
        db,
        inventory_id,
    )

    if not inventory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory record not found.",
        )

    return inventory


# ==========================================================
# UPDATE INVENTORY
# Admin + Manager only
# ==========================================================

@router.put("/{inventory_id}")
def update_inventory_record(
    inventory_id: int,
    inventory: InventoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("Admin", "Manager")
    ),
):
    try:
        return update_inventory(
            db,
            inventory_id,
            inventory,
        )

    except ValueError as e:
        message = str(e)

        if (
            "Inventory record not found"
            in message
        ):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message,
            )

        if "Product not found" in message:
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


# ==========================================================
# DELETE INVENTORY
# Admin + Manager only
# ==========================================================

@router.delete("/{inventory_id}")
def delete_inventory_record(
    inventory_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("Admin", "Manager")
    ),
):
    try:
        return delete_inventory(
            db,
            inventory_id,
        )

    except ValueError as e:
        message = str(e)

        if (
            "Inventory record not found"
            in message
        ):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message,
            )

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=message,
        )