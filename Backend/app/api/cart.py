from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.models.cart import Cart
from app.models.product import Product
from app.schemas.cart import CartCreate
from database.connection import get_db
from app.api.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/cart", tags=["Cart"])

@router.post("/", summary="Add product to user's cart")
def add_to_cart(cart: CartCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == cart.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if product.quantity < cart.quantity:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient stock available (Available: {product.quantity})",
        )

    existing_item = (
        db.query(Cart)
        .filter(Cart.user_id == current_user.id, Cart.product_id == cart.product_id)
        .first()
    )

    if existing_item:
        existing_item.quantity += cart.quantity
    else:
        new_item = Cart(
            user_id=current_user.id,
            product_id=cart.product_id,
            quantity=cart.quantity,
        )
        db.add(new_item)

    product.quantity -= cart.quantity
    db.commit()
    db.refresh(product)

    return {"message": "Product added to cart successfully"}


@router.get("/", summary="Get all items in user's cart")
def get_user_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):

    print(f"{current_user}::::kehghsdkjg")
    cart_items = (
        db.query(Cart)
        .join(Product)
        .filter(Cart.user_id == current_user.id)
        .with_entities(
            Cart.id.label("id"),
            Cart.quantity.label("quantity"),
            Product.id.label("product_id"),
            Product.name.label("name"),
            Product.image.label("image"),
            Product.price.label("price"),
            Product.quantity.label("stock_quantity"),
        )
        .all()
    )

    if not cart_items:
        return {"message": "Cart is empty", "items": []}

    formatted_items = []
    total_amount = 0

    for item in cart_items:
        total_price = item.price * item.quantity
        total_amount += total_price
        formatted_items.append({
            "id": item.id,
            "quantity": item.quantity,
            "product": {
                "id": item.product_id,
                "name": item.name,
                "image": item.image,
                "price": item.price,
                "stock_quantity": item.stock_quantity,
            },
        })

    return {
        "user_id": current_user.id,
        "total_items": len(formatted_items),
        "total_amount": total_amount,
        "items": formatted_items,
    }


@router.put("/update_quantity", summary="Update quantity for cart item")
def update_cart_quantity(
    cart_id: int = Query(...),
    quantity: int = Query(..., gt=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cart_item = db.query(Cart).filter(Cart.id == cart_id, Cart.user_id == current_user.id).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    product = db.query(Product).filter(Product.id == cart_item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    diff = quantity - cart_item.quantity
    if diff > 0:
        if product.quantity < diff:
            raise HTTPException(status_code=400, detail="Insufficient stock available")
        product.quantity -= diff
    elif diff < 0:
        product.quantity += abs(diff)

    cart_item.quantity = quantity
    db.commit()
    db.refresh(cart_item)
    db.refresh(product)

    return {"message": "Cart updated successfully", "cart_id": cart_id, "new_quantity": quantity}


@router.delete("/remove/{cart_id}", summary="Remove item from user's cart")
def remove_cart_item(cart_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart_item = db.query(Cart).filter(Cart.id == cart_id, Cart.user_id == current_user.id).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    product = db.query(Product).filter(Product.id == cart_item.product_id).first()
    if product:
        product.quantity += cart_item.quantity

    db.delete(cart_item)
    db.commit()

    return {"message": "Item removed from cart successfully"}


@router.delete("/clear", summary="Clear all items after order")
def clear_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(Cart).filter(Cart.user_id == current_user.id).all()
    if not items:
        return {"message": "Cart already empty"}

    for item in items:
        db.delete(item)

    db.commit()
    return {"message": "Cart cleared after order placement"}
