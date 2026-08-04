from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    role_id = Column(Integer, ForeignKey("roles.role_id"))

    full_name = Column(String(100))
    email = Column(String(100), unique=True)
    password_hash = Column(String(255))
    phone = Column(String(20))
    status = Column(String(20))

    role = relationship("Role")