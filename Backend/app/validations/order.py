# from pydantic import BaseModel
# from typing import List

# class OrderItemData(BaseModel):
#     product_id: int
#     quantity: int

# class OrderCreate(BaseModel):
#     user_id: int
#     items: List[OrderItemData]









from pydantic import BaseModel, Field
from typing import List

class OrderItemData(BaseModel):
    product_id: int = Field(..., description="Product ID being ordered")
    quantity: int = Field(..., gt=0, description="Quantity of the product")

    class Config:
        orm_mode = True


class OrderCreate(BaseModel):
    user_id: int = Field(..., description="ID of the user placing the order")
    items: List[OrderItemData] = Field(..., description="List of ordered items with quantity")

    class Config:
        orm_mode = True
