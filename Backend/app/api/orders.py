from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.cart import Cart
from app.models.product import Product
from app.models.user import User
from app.schemas.order import OrderCreate, OrderItemCreate
from database.connection import get_db

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/", summary="Place an order from user's cart")
def place_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    """
    Creates an Order from the user's current cart items.
    Steps:
      - Validate user and cart
      - Create Order record with total_amount
      - Create OrderItem records (price taken from product)
      - Clear the cart for that user
    Note: stock was already reduced when items were added to cart.
    """
    user = db.query(User).filter(User.id == order_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    cart_items = db.query(Cart).filter(Cart.user_id == order_data.user_id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Calculate total and validate product existence
    total_amount = 0.0
    for ci in cart_items:
        product = db.query(Product).filter(Product.id == ci.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {ci.product_id} not found")
        # price at order-time
        total_amount += product.price * ci.quantity

    # Create Order
    new_order = Order(
        user_id=order_data.user_id,
        total_amount=total_amount,
        status="pending"
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    # Create OrderItems
    for ci in cart_items:
        product = db.query(Product).filter(Product.id == ci.product_id).first()
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=product.id,
            quantity=ci.quantity,
            price=product.price
        )
        db.add(order_item)

    # Remove cart items
    for ci in cart_items:
        db.delete(ci)

    db.commit()
    db.refresh(new_order)

    return {
        "message": "Order placed successfully",
        "order_id": new_order.id,
        "total_amount": new_order.total_amount,
        "status": new_order.status
    }


@router.get("/{order_id}", summary="Get order by id")
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    items = [
        {
            "order_item_id": oi.id,
            "product_id": oi.product_id,
            "quantity": oi.quantity,
            "price": oi.price
        } for oi in order.order_items
    ]

    return {
        "order_id": order.id,
        "user_id": order.user_id,
        "total_amount": order.total_amount,
        "status": order.status,
        "created_at": order.created_at,
        "items": items
    }
