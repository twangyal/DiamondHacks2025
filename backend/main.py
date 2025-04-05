from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from . import crud, models, schemas, database

# Create FastAPI instance
app = FastAPI()

# Dependency to get the database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Example route: Get all products
@app.get("/products/")
def get_products(db: Session = Depends(get_db)):
    return crud.get_products(db)

# Example route: Create a product
@app.post("/products/")
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db, product)
