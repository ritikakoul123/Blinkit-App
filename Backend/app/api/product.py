from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate
from database.connection import get_db
from app.api.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("/")
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.name != "Admin":
        raise HTTPException(status_code=403, detail="Only admin can add products")
    new_product = Product(
        name=product.name,
        category=product.category,
        price=product.price,
        units=",".join(product.units),
        image=product.image
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.get("/")
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return products

@router.put("/{product_id}")
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.name != "Admin":
        raise HTTPException(status_code=403, detail="Only admin can update products")
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product_data.name:
        product.name = product_data.name
    if product_data.category:
        product.category = product_data.category
    if product_data.price:
        product.price = product_data.price
    if product_data.units:
        product.units = ",".join(product_data.units)
    if product_data.image is not None:
        product.image = product_data.image
    db.commit()
    db.refresh(product)
    return product

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.name != "Admin":
        raise HTTPException(status_code=403, detail="Only admin can delete products")
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}
