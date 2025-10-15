from pydantic import BaseModel, Field

class CartCreate(BaseModel):
    user_id: int = Field(..., example=1)
    product_id: int = Field(..., example=5)
    quantity: int = Field(..., gt=0, example=2)
