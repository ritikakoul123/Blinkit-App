from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.connection import Base, engine
from app.api import auth, product, cart, orders
from fastapi.responses import FileResponse
import os

app = FastAPI(title="Blinkit API", version="1.0")

# Create database tables
Base.metadata.create_all(bind=engine)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # replace "*" with frontend URL in production
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

# Optional: Add favicon route
@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    favicon_path = os.path.join(os.path.dirname(__file__), "static", "favicon.ico")
    if os.path.exists(favicon_path):
        return FileResponse(favicon_path)
    return FileResponse("app/static/default-favicon.ico")
