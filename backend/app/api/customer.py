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

from app.schemas.customer_schema import (
    CustomerCreate,
    CustomerUpdate,
)

from app.services.customer_service import (
    create_customer,
    get_all_customers,
    get_customer_by_id,
    update_customer,
    delete_customer,
)


router = APIRouter()


@router.post("/")
def create_new_customer(
    customer: CustomerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return create_customer(
            db,
            customer,
        )

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
def get_customers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_all_customers(db)


@router.get("/{customer_id}")
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    customer = get_customer_by_id(
        db,
        customer_id,
    )

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found.",
        )

    return customer


@router.put("/{customer_id}")
def update_customer_record(
    customer_id: int,
    customer: CustomerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return update_customer(
            db,
            customer_id,
            customer,
        )

    except ValueError as e:
        message = str(e)

        if "Customer not found" in message:
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


@router.delete("/{customer_id}")
def delete_customer_record(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return delete_customer(
            db,
            customer_id,
        )

    except ValueError as e:
        message = str(e)

        if "Customer not found" in message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message,
            )

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=message,
        )