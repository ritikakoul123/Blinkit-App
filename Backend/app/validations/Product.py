from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    image: str | None = None
    units: str
