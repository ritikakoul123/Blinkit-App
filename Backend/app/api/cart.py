from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import SessionLocal
from app.models.cart import Cart
from app.validations.cart import CartCreate

router = APIRouter(prefix="/cart", tags=["Cart"])

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Add item to cart
@router.post("/", summary="Add item to cart")
def add_to_cart(cart: CartCreate, db: Session = Depends(get_db)):
    new_item = Cart(
        user_id=cart.user_id,
        product_id=cart.product_id,
        quantity=cart.quantity
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return {"message": "Item added to cart", "cart_id": new_item.id}


# Get user's cart items
@router.get("/{user_id}", summary="Get all items in user's cart")
def get_cart(user_id: int, db: Session = Depends(get_db)):
    items = db.query(Cart).filter(Cart.user_id == user_id).all()
    return items


# Remove item from cart
@router.delete("/{cart_id}", summary="Remove item from cart")
def remove_from_cart(cart_id: int, db: Session = Depends(get_db)):
    item = db.query(Cart).filter(Cart.id == cart_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(item)
    db.commit()
    return {"message": "Item removed from cart"}

