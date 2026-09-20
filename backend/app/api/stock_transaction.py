from datetime import datetime

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.core.auth import (
    get_current_user,
    require_roles,
)

from app.models.user import User

from app.schemas.stock_transaction import (
    StockTransactionCreate,
    StockInCreate,
    StockOutCreate,
    StockTransactionResponse,
)

from app.services.stock_transaction_service import (
    create_stock_transaction,
    get_all_stock_transactions,
    get_stock_transaction_by_id,
    update_stock_transaction,
    delete_stock_transaction,
)


router = APIRouter(
    prefix="/stock-transactions",
    tags=["Stock Transactions"],
)


# ======================================================
# CREATE STOCK TRANSACTION
# Admin + Manager only
#
# Existing generic CRUD endpoint.
# Supports IN / OUT.
# ======================================================

@router.post(
    "/",
    response_model=StockTransactionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_stock_transaction(
    transaction: StockTransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("Admin", "Manager")
    ),
):
    try:
        return create_stock_transaction(
            db,
            transaction,
        )

    except ValueError as error:
        message = str(error)

        if "Product not found" in message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message,
            )

        if "Inventory record not found" in message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message,
            )

        if "Insufficient stock" in message:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=message,
            )

        if (
            "Transaction type" in message
            or "Quantity" in message
            or "Reason" in message
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message,
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message,
        )


# ======================================================
# STOCK IN
# Admin + Manager only
#
# Business operation:
# Inventory quantity increases
# AND
# IN transaction is created atomically.
# ======================================================

@router.post(
    "/stock-in",
    response_model=StockTransactionResponse,
    status_code=status.HTTP_201_CREATED,
)
def stock_in(
    stock_in_data: StockInCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("Admin", "Manager")
    ),
):
    transaction = StockTransactionCreate(
        product_id=stock_in_data.product_id,
        transaction_type="IN",
        quantity=stock_in_data.quantity,
        transaction_date=datetime.utcnow(),
        reason=stock_in_data.reason,
    )

    try:
        return create_stock_transaction(
            db,
            transaction,
        )

    except ValueError as error:
        message = str(error)

        if "Product not found" in message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message,
            )

        if (
            "Quantity" in message
            or "Reason" in message
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message,
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message,
        )


# ======================================================
# STOCK OUT
# Admin + Manager only
#
# Business operation:
# Validate available stock
# ↓
# Inventory quantity decreases
# ↓
# OUT transaction is created atomically.
# ======================================================

@router.post(
    "/stock-out",
    response_model=StockTransactionResponse,
    status_code=status.HTTP_201_CREATED,
)
def stock_out(
    stock_out_data: StockOutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("Admin", "Manager")
    ),
):
    transaction = StockTransactionCreate(
        product_id=stock_out_data.product_id,
        transaction_type="OUT",
        quantity=stock_out_data.quantity,
        transaction_date=datetime.utcnow(),
        reason=stock_out_data.reason,
    )

    try:
        return create_stock_transaction(
            db,
            transaction,
        )

    except ValueError as error:
        message = str(error)

        if "Product not found" in message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message,
            )

        if "Inventory record not found" in message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message,
            )

        if "Insufficient stock" in message:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=message,
            )

        if (
            "Quantity" in message
            or "Reason" in message
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message,
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message,
        )


# ======================================================
# GET ALL STOCK TRANSACTIONS / FILTER
# All authenticated users
# ======================================================

@router.get(
    "/",
    response_model=list[
        StockTransactionResponse
    ],
)
def get_stock_transactions(
    product_id: int | None = Query(
        default=None,
        ge=1,
        description="Filter by product ID.",
    ),
    transaction_type: str | None = Query(
        default=None,
        description="Filter by transaction type: IN or OUT.",
    ),
    start_date: datetime | None = Query(
        default=None,
        description="Return transactions from this date/time onward.",
    ),
    end_date: datetime | None = Query(
        default=None,
        description="Return transactions up to this date/time.",
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    # --------------------------------------------------
    # Validate date range
    # --------------------------------------------------

    if (
        start_date is not None
        and end_date is not None
        and start_date > end_date
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "start_date cannot be later "
                "than end_date."
            ),
        )

    try:
        return get_all_stock_transactions(
            db=db,
            product_id=product_id,
            transaction_type=transaction_type,
            start_date=start_date,
            end_date=end_date,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


# ======================================================
# GET STOCK TRANSACTION BY ID
# All authenticated users
# ======================================================

@router.get(
    "/{transaction_id}",
    response_model=StockTransactionResponse,
)
def get_stock_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    transaction = get_stock_transaction_by_id(
        db,
        transaction_id,
    )

    if transaction is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stock transaction not found.",
        )

    return transaction


# ======================================================
# UPDATE STOCK TRANSACTION
# Admin + Manager only
# ======================================================

@router.put(
    "/{transaction_id}",
    response_model=StockTransactionResponse,
)
def update_existing_stock_transaction(
    transaction_id: int,
    transaction: StockTransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("Admin", "Manager")
    ),
):
    try:
        updated_transaction = (
            update_stock_transaction(
                db,
                transaction_id,
                transaction,
            )
        )

        if updated_transaction is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Stock transaction not found.",
            )

        return updated_transaction

    except ValueError as error:
        message = str(error)

        if "Product not found" in message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message,
            )

        if (
            "Transaction type" in message
            or "Quantity" in message
            or "Reason" in message
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message,
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message,
        )


# ======================================================
# DELETE STOCK TRANSACTION
# Admin + Manager only
# ======================================================

@router.delete(
    "/{transaction_id}"
)
def delete_existing_stock_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("Admin", "Manager")
    ),
):
    try:
        deleted_transaction = (
            delete_stock_transaction(
                db,
                transaction_id,
            )
        )

        if deleted_transaction is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Stock transaction not found.",
            )

        return {
            "message": (
                "Stock transaction deleted "
                "successfully."
            ),
            "transaction_id": transaction_id,
        }

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        )