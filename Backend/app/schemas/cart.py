# from pydantic import BaseModel
# from typing import Optional


# class CartBase(BaseModel):
#     user_id: int
#     product_id: int
#     quantity: Optional[int] = 1


# class CartCreate(CartBase):
#     pass


# class CartUpdate(BaseModel):
#     quantity: int


# class CartResponse(BaseModel):
#     id: int
#     user_id: int
#     product_id: int
#     quantity: int

#     class Config:
#         orm_mode = True



from pydantic import BaseModel
from typing import Optional

class CartBase(BaseModel):
    product_id: int
    quantity: Optional[int] = 1

class CartCreate(CartBase):
    pass

class CartUpdate(BaseModel):
    quantity: int

class CartResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    quantity: int

    class Config:
        orm_mode = True
