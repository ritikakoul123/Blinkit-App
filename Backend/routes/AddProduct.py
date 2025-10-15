from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal
from app.models.product import Product

router = APIRouter(prefix="/products", tags=["Products"])

# Create DB session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic model for request validation
class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    units: list[str]
    image: str

# Add product
@router.post("/")
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(
        name=product.name,
        category=product.category,
        price=product.price,
        units=",".join(product.units),  # store as comma-separated string
        image=product.image,
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

# Fetch all products
@router.get("/")
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()
