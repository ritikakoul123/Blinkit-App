from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import SessionLocal
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.user import User
from app.models.product import Product
from app.validations.order import OrderCreate

router = APIRouter(prefix="/orders", tags=["Orders"])

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Place a new order
@router.post("/", summary="Place a new order")
def place_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == order_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    total_amount = 0.0
    items = []

    for item in order_data.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product ID {item.product_id} not found")

        total_amount += product.price * item.quantity
        items.append(OrderItem(product_id=product.id, quantity=item.quantity, price=product.price))

    order = Order(user_id=user.id, total_amount=total_amount)
    db.add(order)
    db.commit()
    db.refresh(order)

    for i in items:
        i.order_id = order.id
        db.add(i)
    db.commit()

    return {
        "message": "Order placed successfully",
        "order_id": order.id,
        "total_amount": total_amount
    }


# Get all orders
@router.get("/", summary="Get all orders")
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).all()
    return orders


# Get orders by user ID
@router.get("/user/{user_id}", summary="Get orders by user ID")
def get_user_orders(user_id: int, db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.user_id == user_id).all()
    return orders
