from sqlalchemy.orm import Session
from app.core.security import verify_password
from app.core.auth import create_access_token
from app.models.user import User
from app.schemas.user_schema import UserRegister
from app.core.security import hash_password


def register_user(db: Session, user: UserRegister):
    """
    Register a new user.
    """

    # Check if email already exists
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise ValueError("Email already registered.")

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password_hash=hash_password(user.password),
        phone=user.phone,
        status="ACTIVE",
        role_id=1
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user
def login_user(db: Session, email: str, password: str):
    """
    Authenticate a user and return a JWT token.
    """

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise ValueError("Invalid email or password.")

    if not verify_password(password, user.password_hash):
        raise ValueError("Invalid email or password.")

    access_token = create_access_token(
        data={"sub": user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }