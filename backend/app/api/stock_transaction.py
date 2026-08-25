from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.stock_transaction import (
    StockTransactionCreate,
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


@router.post(
    "/",
    response_model=StockTransactionResponse
)
def create_new_stock_transaction(
    transaction: StockTransactionCreate,
    db: Session = Depends(get_db)
):
    try:
        return create_stock_transaction(
            db,
            transaction
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


@router.get(
    "/",
    response_model=list[StockTransactionResponse]
)
def get_stock_transactions(
    db: Session = Depends(get_db)
):
    return get_all_stock_transactions(db)


@router.get(
    "/{transaction_id}",
    response_model=StockTransactionResponse
)
def get_stock_transaction(
    transaction_id: int,
    db: Session = Depends(get_db)
):
    transaction = get_stock_transaction_by_id(
        db,
        transaction_id
    )

    if transaction is None:
        raise HTTPException(
            status_code=404,
            detail="Stock transaction not found"
        )

    return transaction


@router.put(
    "/{transaction_id}",
    response_model=StockTransactionResponse
)
def update_existing_stock_transaction(
    transaction_id: int,
    transaction: StockTransactionCreate,
    db: Session = Depends(get_db)
):
    updated_transaction = update_stock_transaction(
        db,
        transaction_id,
        transaction
    )

    if updated_transaction is None:
        raise HTTPException(
            status_code=404,
            detail="Stock transaction not found"
        )

    return updated_transaction


@router.delete(
    "/{transaction_id}"
)
def delete_existing_stock_transaction(
    transaction_id: int,
    db: Session = Depends(get_db)
):
    deleted_transaction = delete_stock_transaction(
        db,
        transaction_id
    )

    if deleted_transaction is None:
        raise HTTPException(
            status_code=404,
            detail="Stock transaction not found"
        )

    return {
        "message": "Stock transaction deleted successfully"
    }