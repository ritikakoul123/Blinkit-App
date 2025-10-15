from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate

router = APIRouter(prefix="/products", tags=["Products"])

# Get all products
@router.get("/")
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.deleted_at == False).all()
    return products

# Get single product by id
@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id, Product.deleted_at == False).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# Add new product
@router.post("/")
def add_product(product_data: ProductCreate, db: Session = Depends(get_db)):
    product = Product(
        name=product_data.name,
        category=product_data.category,
        price=product_data.price,
        image=product_data.image,
        units=",".join(product_data.units) if product_data.units else ""
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return {"message": "Product added", "product": product}

# Update product
@router.put("/{product_id}")
def update_product(product_id: int, product_data: ProductUpdate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.name = product_data.name or product.name
    product.category = product_data.category or product.category
    product.price = product_data.price or product.price
    product.image = product_data.image or product.image
    if product_data.units:
        product.units = ",".join(product_data.units)
    db.commit()
    db.refresh(product)
    return {"message": "Product updated", "product": product}

# Delete product (soft delete)
@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.deleted_at = True
    db.commit()
    return {"message": "Product deleted"}
