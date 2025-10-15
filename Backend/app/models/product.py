from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from datetime import datetime
from sqlalchemy.orm import relationship
from database.connection import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(100))
    price = Column(Float, nullable=False)
    units = Column(String(100))
    image = Column(String(255))
    quantity = Column(Integer, default=0, nullable=False)
    deleted_at = Column(Boolean, default=False)

    # Add this relationship (it was missing)
    order_items = relationship("OrderItem", back_populates="product", cascade="all, delete-orphan")
    carts = relationship("Cart", back_populates="product")
