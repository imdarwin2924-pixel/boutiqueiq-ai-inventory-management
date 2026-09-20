from sqlalchemy.orm import Session

from app.core.security import verify_password
from app.core.security import hash_password
from app.core.auth import create_access_token

from app.models.user import User
from app.models.role import Role

from app.schemas.user_schema import UserRegister


def register_user(db: Session, user: UserRegister):
    """
    Register a new user with the Staff role by default.
    """

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise ValueError("Email already registered.")

    # Find the Staff role
    staff_role = (
        db.query(Role)
        .filter(Role.role_name.ilike("Staff"))
        .first()
    )

    if staff_role is None:
        raise ValueError(
            "Staff role is not configured in the database."
        )

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password_hash=hash_password(user.password),
        phone=user.phone,
        status="ACTIVE",
        role_id=staff_role.role_id,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def login_user(
    db: Session,
    email: str,
    password: str
):
    """
    Authenticate a user and return a role-aware JWT token.
    """

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        raise ValueError("Invalid email or password.")

    if not verify_password(
        password,
        user.password_hash
    ):
        raise ValueError("Invalid email or password.")

    # Make sure the user has a valid role
    if user.role is None:
        raise ValueError(
            "User role is not configured."
        )

    access_token = create_access_token(
        data={
            "sub": user.email,
            "role": user.role.role_name,
            "role_id": user.role_id,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }