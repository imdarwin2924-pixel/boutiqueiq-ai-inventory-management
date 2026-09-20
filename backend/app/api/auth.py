from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.core.auth import (
    get_current_user,
    require_roles,
)

from app.models.user import User

from app.schemas.user_schema import UserRegister

from app.services.auth_service import (
    register_user,
    login_user,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):
    try:
        new_user = register_user(db, user)

        return {
            "message": "User registered successfully.",
            "user_id": new_user.user_id
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    try:
        return login_user(
            db,
            form_data.username,
            form_data.password
        )

    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )


@router.get("/me")
def get_profile(
    current_user: User = Depends(get_current_user)
):
    return {
        "user_id": current_user.user_id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "phone": current_user.phone,
        "status": current_user.status,
        "role_id": current_user.role_id,
        "role_name": (
            current_user.role.role_name
            if current_user.role
            else None
        ),
    }


@router.get("/rbac-test")
def rbac_test(
    current_user: User = Depends(
        require_roles("Admin", "Manager")
    )
):
    return {
        "message": "RBAC authorization successful.",
        "user_id": current_user.user_id,
        "full_name": current_user.full_name,
        "role_id": current_user.role_id,
        "role_name": current_user.role.role_name,
    }