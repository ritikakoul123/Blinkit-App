from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.models.product import Product
from app.models.cart import Cart
from app.schemas.product import ProductCreate, ProductUpdate
from database.connection import get_db
from app.api.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/products", tags=["Products"])


@router.post("/", response_model=dict)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.name.lower() != "admin":
        raise HTTPException(status_code=403, detail="Only admin can add products")

    new_product = Product(
        name=product.name,
        category=product.category,
        price=product.price,
        units=",".join(product.units) if isinstance(product.units, list) else product.units,
        image=product.image,
        quantity=product.quantity or 0
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return {"message": "Product created successfully", "product": new_product.name}


@router.get("/", response_model=list[dict])
def get_products(
    db: Session = Depends(get_db),
    user_id: int = Query(None, description="Optional user_id to include cart info")
):
    products = db.query(Product).all()

    if user_id is not None:
        cart_items = db.query(Cart).filter(Cart.user_id == user_id).all()
        cart_map = {ci.product_id: ci.quantity for ci in cart_items}

        product_list = []
        for p in products:
            status = "Out of Stock" if p.quantity <= 0 else "In Stock"
            product_list.append({
                "id": p.id,
                "name": p.name,
                "category": p.category,
                "price": p.price,
                "units": p.units.split(",") if p.units else [],
                "image": p.image,
                "quantity": p.quantity,
                "status": status,
                "in_cart": p.id in cart_map,
                "cart_quantity": cart_map.get(p.id, 0)
            })
        return product_list

    return [
        {
            "id": p.id,
            "name": p.name,
            "category": p.category,
            "price": p.price,
            "units": p.units.split(",") if p.units else [],
            "image": p.image,
            "quantity": p.quantity,
            "status": "Out of Stock" if p.quantity <= 0 else "In Stock"
        }
        for p in products
    ]


@router.get("/{product_id}", response_model=dict)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    status = "Out of Stock" if product.quantity <= 0 else "In Stock"
    return {
        "id": product.id,
        "name": product.name,
        "category": product.category,
        "price": product.price,
        "units": product.units.split(",") if product.units else [],
        "image": product.image,
        "quantity": product.quantity,
        "status": status
    }


@router.put("/{product_id}", response_model=dict)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.name.lower() != "admin":
        raise HTTPException(status_code=403, detail="Only admin can update products")

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        if key == "units" and isinstance(value, list):
            value = ",".join(value)
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return {"message": "Product updated successfully", "product": product.name}


@router.delete("/{product_id}", response_model=dict)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.name.lower() != "admin":
        raise HTTPException(status_code=403, detail="Only admin can delete products")

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}

@router.put("/{product_id}/stock")
def update_stock(product_id: int, quantity_change: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.quantity += quantity_change
    db.commit()
    db.refresh(product)
    return {"message": "Stock updated successfully", "new_stock": product.quantity}








# from fastapi import APIRouter, Depends, HTTPException, Query
# from sqlalchemy.orm import Session
# from app.models.product import Product
# from app.models.cart import Cart
# from app.schemas.product import ProductCreate, ProductUpdate
# from database.connection import get_db
# from app.api.auth import get_current_user
# from app.models.user import User

# router = APIRouter(prefix="/products", tags=["Products"])


# @router.post("/", response_model=dict)
# def create_product(
#     product: ProductCreate,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     if current_user.role.name.lower() != "admin":
#         raise HTTPException(status_code=403, detail="Only admin can add products")

#     new_product = Product(
#         name=product.name,
#         category=product.category,
#         price=product.price,
#         units=",".join(product.units) if isinstance(product.units, list) else product.units,
#         image=product.image,
#         quantity=product.quantity or 0
#     )

#     db.add(new_product)
#     db.commit()
#     db.refresh(new_product)
#     return {"message": "Product created successfully", "product": new_product.name}


# #UPDATED: GET products with pagination, filters, and search
# @router.get("/", response_model=dict)
# def get_products(
#     db: Session = Depends(get_db),
#     user_id: int = Query(None, description="Optional user_id to include cart info"),
#     page: int = Query(1, ge=1, description="Page number"),
#     limit: int = Query(6, ge=1, le=50, description="Number of products per page"),
#     category: str = Query(None, description="Filter by category"),
#     search: str = Query(None, description="Search by product name"),
# ):
#     query = db.query(Product)

#     # Apply filters
#     if category:
#         query = query.filter(Product.category.ilike(f"%{category}%"))
#     if search:
#         query = query.filter(Product.name.ilike(f"%{search}%"))

#     total = query.count()
#     products = query.offset((page - 1) * limit).limit(limit).all()

#     # For cart integration
#     if user_id is not None:
#         cart_items = db.query(Cart).filter(Cart.user_id == user_id).all()
#         cart_map = {ci.product_id: ci.quantity for ci in cart_items}

#         product_list = []
#         for p in products:
#             status = "Out of Stock" if p.quantity <= 0 else "In Stock"
#             product_list.append({
#                 "id": p.id,
#                 "name": p.name,
#                 "category": p.category,
#                 "price": p.price,
#                 "units": p.units.split(",") if p.units else [],
#                 "image": p.image,
#                 "quantity": p.quantity,
#                 "status": status,
#                 "in_cart": p.id in cart_map,
#                 "cart_quantity": cart_map.get(p.id, 0)
#             })
#     else:
#         product_list = [
#             {
#                 "id": p.id,
#                 "name": p.name,
#                 "category": p.category,
#                 "price": p.price,
#                 "units": p.units.split(",") if p.units else [],
#                 "image": p.image,
#                 "quantity": p.quantity,
#                 "status": "Out of Stock" if p.quantity <= 0 else "In Stock",
#             }
#             for p in products
#         ]

#     return {
#         "total": total,
#         "page": page,
#         "limit": limit,
#         "pages": (total + limit - 1) // limit,
#         "products": product_list,
#     }


# @router.get("/{product_id}", response_model=dict)
# def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
#     product = db.query(Product).filter(Product.id == product_id).first()
#     if not product:
#         raise HTTPException(status_code=404, detail="Product not found")

#     status = "Out of Stock" if product.quantity <= 0 else "In Stock"
#     return {
#         "id": product.id,
#         "name": product.name,
#         "category": product.category,
#         "price": product.price,
#         "units": product.units.split(",") if product.units else [],
#         "image": product.image,
#         "quantity": product.quantity,
#         "status": status
#     }


# @router.put("/{product_id}", response_model=dict)
# def update_product(
#     product_id: int,
#     product_data: ProductUpdate,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     if current_user.role.name.lower() != "admin":
#         raise HTTPException(status_code=403, detail="Only admin can update products")

#     product = db.query(Product).filter(Product.id == product_id).first()
#     if not product:
#         raise HTTPException(status_code=404, detail="Product not found")

#     update_data = product_data.dict(exclude_unset=True)
#     for key, value in update_data.items():
#         if key == "units" and isinstance(value, list):
#             value = ",".join(value)
#         setattr(product, key, value)

#     db.commit()
#     db.refresh(product)
#     return {"message": "Product updated successfully", "product": product.name}


# @router.delete("/{product_id}", response_model=dict)
# def delete_product(
#     product_id: int,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     if current_user.role.name.lower() != "admin":
#         raise HTTPException(status_code=403, detail="Only admin can delete products")

#     product = db.query(Product).filter(Product.id == product_id).first()
#     if not product:
#         raise HTTPException(status_code=404, detail="Product not found")

#     db.delete(product)
#     db.commit()
#     return {"message": "Product deleted successfully"}


# @router.put("/{product_id}/stock")
# def update_stock(product_id: int, quantity_change: int, db: Session = Depends(get_db)):
#     product = db.query(Product).filter(Product.id == product_id).first()
#     if not product:
#         raise HTTPException(status_code=404, detail="Product not found")

#     product.quantity += quantity_change
#     db.commit()
#     db.refresh(product)
#     return {"message": "Stock updated successfully", "new_stock": product.quantity}
