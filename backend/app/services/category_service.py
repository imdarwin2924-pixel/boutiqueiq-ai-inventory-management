from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.category import Category
from app.schemas.category_schema import (
    CategoryCreate,
    CategoryUpdate,
)


def create_category(db: Session, category: CategoryCreate):

    existing = (
        db.query(Category)
        .filter(Category.category_name == category.category_name)
        .first()
    )

    if existing:
        raise ValueError("Category already exists.")

    new_category = Category(
        category_name=category.category_name,
        description=category.description,
    )

    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return new_category


def get_all_categories(db: Session):
    return db.query(Category).all()


def get_category_by_id(db: Session, category_id: int):
    return (
        db.query(Category)
        .filter(Category.category_id == category_id)
        .first()
    )


def update_category(
    db: Session,
    category_id: int,
    category: CategoryUpdate,
):
    existing = get_category_by_id(db, category_id)

    if not existing:
        raise ValueError("Category not found.")

    duplicate = (
        db.query(Category)
        .filter(
            Category.category_name == category.category_name,
            Category.category_id != category_id,
        )
        .first()
    )

    if duplicate:
        raise ValueError("Category already exists.")

    existing.category_name = category.category_name
    existing.description = category.description

    db.commit()
    db.refresh(existing)

    return existing


def delete_category(db: Session, category_id: int):

    category = get_category_by_id(db, category_id)

    if not category:
        raise ValueError("Category not found.")

    try:
        db.delete(category)
        db.commit()

        return {
            "message": "Category deleted successfully."
        }

    except IntegrityError:
        db.rollback()

        raise ValueError(
            "Cannot delete category because it is being used by another record."
        )