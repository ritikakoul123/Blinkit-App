from pydantic import BaseModel
from typing import List, Optional

class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    image: Optional[str] = None
    units: Optional[List[str]] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    image: Optional[str] = None
    units: Optional[List[str]] = None
