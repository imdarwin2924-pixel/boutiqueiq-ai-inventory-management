from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.database.database import get_db
from app.core.auth import get_current_user
from app.models.user import User

from app.schemas.inventory_schema import (
    InventoryCreate,
    InventoryUpdate,
)

from app.services.inventory_service import (
    create_inventory,
    get_all_inventory,
    get_inventory_by_id,
    update_inventory,
    delete_inventory,
)


router = APIRouter()


@router.post("/")
def create_new_inventory(
    inventory: InventoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
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


@router.get("/")
def get_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_all_inventory(db)


@router.get("/{inventory_id}")
def get_inventory_record(
    inventory_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
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


@router.put("/{inventory_id}")
def update_inventory_record(
    inventory_id: int,
    inventory: InventoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return update_inventory(
            db,
            inventory_id,
            inventory,
        )

    except ValueError as e:
        message = str(e)

        if "Inventory record not found" in message:
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


@router.delete("/{inventory_id}")
def delete_inventory_record(
    inventory_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return delete_inventory(
            db,
            inventory_id,
        )

    except ValueError as e:
        message = str(e)

        if "Inventory record not found" in message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message,
            )

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=message,
        )