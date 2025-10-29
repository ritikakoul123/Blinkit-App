from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.connection import Base, engine
from app.api import auth, product, cart, orders
from fastapi.responses import FileResponse
import os
from fastapi import FastAPI
from app.api.cart import router as cart_router

# Import models so that SQLAlchemy can detect them before creating tables
from app.models import *

# Initialize FastAPI app
app = FastAPI(title="Blinkit API", version="1.0")

# Create all database tables
Base.metadata.create_all(bind=engine)

# Enable CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(product.router)
app.include_router(cart.router)
app.include_router(orders.router)

# Root endpoint
@app.get("/")
def root():
    return {"message": "Blinkit API running successfully!"}

# Optional favicon route
@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    favicon_path = os.path.join(os.path.dirname(__file__), "static", "favicon.ico")
    if os.path.exists(favicon_path):
        return FileResponse(favicon_path)
    return FileResponse("app/static/default-favicon.ico")
