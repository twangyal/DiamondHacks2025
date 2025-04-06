from fastapi import FastAPI, Depends, HTTPException
from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine
from sqlalchemy.orm import Session
import crud, schemas, database, security
from fastapi.middleware.cors import CORSMiddleware
import pricing_model.ai_model as ai_model  # Import the AI model for price optimization
import joblib

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

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

@app.get("/explore")
def explore(db: Session = Depends(get_db)):
    products = crud.get_products(db)
    if not products:
        raise HTTPException(status_code=404, detail="No products found")
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
def create_product(Product: schemas.ProductCreate, User: schemas.TokenData = Depends(security.decode_access_token), db: Session = Depends(get_db)):
    # Ensure the user is authenticated
    if not User:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    # Get the seller id from the token
    seller_id = crud.get_user_by_username(db, username=User.username).id
    if not seller_id:
        raise HTTPException(status_code=404, detail="Seller not found")
    # Validate the input data
    product = crud.create_product(db, Product, seller_id)
    if not product:
        raise HTTPException(status_code=500, detail="Failed to create product")
    return product

@app.delete("/item/{product_id}", response_model=schemas.ProductCreate)
def delete_product(product_id: int, User: schemas.TokenData = Depends(security.decode_access_token), db: Session = Depends(get_db)):
    # Ensure the user is authenticated
    if not User:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    # Get the seller id from the token
    seller_id = crud.get_user_by_username(db, username=User.username).id
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

@app.put("/item/{product_id}", response_model=schemas.ProductCreate)
def update_product(product_id: int, Product: schemas.ProductCreate, User: schemas.TokenData = Depends(security.decode_access_token), db: Session = Depends(get_db)):
    # Ensure the user is authenticated
    if not User:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    # Get the seller id from the token
    seller_id = crud.get_user_by_username(db, username=User.username).id
    if not seller_id:
        raise HTTPException(status_code=404, detail="Seller not found")
    
    # Check if the product exists and belongs to the seller
    product = crud.get_product_by_id(db, product_id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product.seller_id != seller_id:
        raise HTTPException(status_code=403, detail="You do not have permission to update this product")

    # Update the product
    updated_product = crud.update_product(db, product_id=product_id, product=Product)
    if not updated_product:
        raise HTTPException(status_code=500, detail="Failed to update product")
    
    return updated_product

@app.get("/listings")
def read_user_data(User: schemas.TokenData = Depends(security.decode_access_token), db: Session = Depends(get_db)):
    # Ensure the user is authenticated
    if not User:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    seller = crud.get_user_by_username(db, username=User.username)
    products = crud.get_products_by_seller_id(db, seller_id=seller.id)
    return products

@app.get("/item/{product_id}")
def get_product_details(product_id: int, User: schemas.TokenData = Depends(security.decode_access_token), db: Session = Depends(get_db)):
    if not User:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    product = crud.get_product_by_id(db, product_id=product_id)
    if not product:
        raise HTTPException(status_code=407, detail="Product not found")
    return product

@app.get("/booked", response_model=list[schemas.BookingResponse])
def get_saved_bookings(User: schemas.TokenData = Depends(security.decode_access_token), db: Session = Depends(get_db)):
    # Ensure the user is authenticated
    if not User:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    # Get the user id from the token
    user = crud.get_user_by_username(db, username=User.username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Fetch the saved bookings for the user
    bookings = crud.get_future_discount_bookings_by_user_id(db, user_id=user.id)
    # Transform bookings to the response model
    bookings_response = []
    for booking in bookings:
        product = crud.get_product_by_id(db, product_id=booking.product_id)
        if product:
            bookings_response.append(
                schemas.BookingResponse(
                    booking_id=booking.id,
                    name=product.name,
                    locked_price=booking.locked_price,
                    current_price=product.current_price,
                    quantity=product.quantity,
                    bookingdate=booking.booked_at.isoformat() if booking.booked_at else None
                )
            )
    
    return bookings_response

@app.post("/book/{product_id}")
def book_product(product_id: int, User: schemas.TokenData = Depends(security.decode_access_token), db: Session = Depends(get_db)):
    # Ensure the user is authenticated
    if not User:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    # Get the user id from the token
    user = crud.get_user_by_username(db, username=User.username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if the product exists
    product = crud.get_product_by_id(db, product_id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if the product is already booked by the user
    existing_booking = crud.get_future_discount_bookings_by_user_id(db, user_id=user.id)
    if existing_booking and existing_booking[0].product_id == product.id:
        # Allow only one booking per product for a user
        raise HTTPException(status_code=400, detail="You already have a booking for this product")
    
    #Check if the booker is the seller of the product
    if product.seller_id == user.id:
        raise HTTPException(status_code=400, detail="You cannot book your own product")

    # Create a booking for the product
    booking = crud.create_future_discount_booking(db, schemas.BookingCreate(product_id=product.id, user_id=user.id))
    if not booking:
        raise HTTPException(status_code=500, detail="Failed to create booking")
    
    return booking

@app.delete("/book/{booking_id}")
def cancel_booking(booking_id: int, User: schemas.TokenData = Depends(security.decode_access_token), db: Session = Depends(get_db)):
    # Ensure the user is authenticated
    if not User:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    # Get the user id from the token
    user = crud.get_user_by_username(db, username=User.username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if the booking exists and belongs to the user
    booking = crud.get_booking_by_id(db, booking_id=booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking.user_id != user.id:
        raise HTTPException(status_code=403, detail="You do not have permission to cancel this booking")

    # Cancel the booking
    deleted_booking = crud.delete_future_discount_booking(db, booking_id=booking_id)
    if not deleted_booking:
        raise HTTPException(status_code=500, detail="Failed to cancel booking")
    
    return deleted_booking

@app.get("/transactions", response_model=list[schemas.TransactionResponse])
def get_user_transactions(User: schemas.TokenData = Depends(security.decode_access_token), db: Session = Depends(get_db)):
    # Ensure the user is authenticated
    if not User:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    # Get the user id from the token
    user = crud.get_user_by_username(db, username=User.username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Fetch the sales data for the user
    sales_data = crud.get_sales_data_by_buyer_id(db, buyer_id=user.id)
    # Transform sales data to the response model
    sales_data_response = []
    for sale in sales_data:
        product = crud.get_product_by_id(db, product_id=sale.product_id)
        if product:
            sales_data_response.append(
                schemas.TransactionResponse(
                    product_name=product.name,
                    quantity_sold=sale.quantity_sold,
                    price=float(sale.price),
                    total_price=float(sale.total_price),
                    sold_at=sale.sold_at.isoformat() if sale.sold_at else None
                )
            )
    return sales_data_response

@app.post("/optimize_pricing",)
def calculate_optimal_prices(User: schemas.TokenData = Depends(security.decode_access_token), db: Session = Depends(get_db)):
    # Ensure the user is authenticated
    if not User:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    # Get the user id from the token
    user = crud.get_user_by_username(db, username=User.username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Fetch all products for the seller
    products = crud.get_products_by_seller_id(db, seller_id=user.id)
    if not products:
        raise HTTPException(status_code=404, detail="No products found for this user")
    
    # Calculate optimal prices for each product using the AI model
    for product in products:
        optimal_price = ai_model.calculate_optimal_price(product)
        change = schemas.PriceChangeCreate(
            product_id=product.id,
            new_price=optimal_price
        )
        crud.create_price_change(db, change)

    return {"Success": True, "message": f"Optimal prices calculated for {len(products)} products."}