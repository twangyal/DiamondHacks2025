from fastapi import FastAPI, Depends, HTTPException
from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine
from sqlalchemy.orm import Session
import crud, schemas, database, security


app = FastAPI()

# Dependency to get the database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

#User API
@app.post("/register", response_model=schemas.UserResponse)
def register(User: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = crud.get_user_by_username(db, username=User.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    existing_email = crud.get_user_by_email(db, email=User.email)
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    # Hash the password before storing it in the database
    hashed_password = security.get_password_hash(User.password)
    # Create a new user in the database
    User.password = hashed_password
    user = crud.create_user(db=db, user=User)  # Pass the hashed password to the create_user function
    if not user:
        raise HTTPException(status_code=500, detail="Failed to create user")
    return user

@app.post("/login", response_model=schemas.Token)
def login(User: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, User.username)
    if not db_user or not security.verify_password(User.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    # Create access token
    access_token_expires = timedelta(minutes=15)
    access_token = security.create_access_token(
        data={"sub": db_user.username}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@app.get('/mylistings')
def read_user_data(User: schemas.TokenData = Depends(security.decode_access_token), db: Session = Depends(get_db)):
    # Ensure the user is authenticated
    if not User:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    seller_id = crud.get_user_by_username(db, username=User.username).id
    products = crud.get_products_by_seller_id(db, seller_id=seller_id)
    return products

@app.get("/users/{username}/products", response_model=list[schemas.ProductCreate])
def get_user_products(username: str, db: Session = Depends(get_db)):
    
    user = crud.get_user_by_username(db, username=username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    products = crud.get_products_by_seller_id(db, seller_id=user.id)
    if not products:
        raise HTTPException(status_code=404, detail="No products found for this user")
    return products

@app.post("/create_product", response_model=schemas.ProductCreate)
def create_product(Product: schemas.ProductCreate, User: schemas.Token = Depends(security.decode_access_token, ), db: Session = Depends(get_db)):
    # Ensure the user is authenticated
    if not User:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    # Get the seller id from the token
    seller_id = crud.get_user_by_username(db, username=User['sub']).id
    if not seller_id:
        raise HTTPException(status_code=404, detail="Seller not found")
    # Create the product in the database
    product = crud.create_product(db, Product, seller_id)
    if not product:
        raise HTTPException(status_code=500, detail="Failed to create product")
    return product

@app.delete("/products/{product_id}", response_model=schemas.ProductCreate)
def delete_product(product_id: int, User: schemas.Token = Depends(security.decode_access_token), db: Session = Depends(get_db)):
    # Ensure the user is authenticated
    if not User:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    # Get the seller id from the token
    seller_id = crud.get_user_by_username(db, username=User['sub']).id
    if not seller_id:
        raise HTTPException(status_code=404, detail="Seller not found")
    
    # Check if the product exists and belongs to the seller
    product = crud.get_product_by_id(db, product_id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product.seller_id != seller_id:
        raise HTTPException(status_code=403, detail="You do not have permission to delete this product")

    # Delete the product
    deleted_product = crud.delete_product(db, product_id=product_id)
    if not deleted_product:
        raise HTTPException(status_code=500, detail="Failed to delete product")
    
    return deleted_product
