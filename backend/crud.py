from sqlalchemy.orm import Session
import model, schemas

def get_products(db: Session):
    return db.query(model.Product).all()

def get_product_by_id(db: Session, product_id: int):
    db_product = db.query(model.Product).filter(model.Product.id == product_id).first()
    return db_product

def get_products_by_seller_id(db: Session, seller_id: int):
    db_products = db.query(model.Product).filter(model.Product.seller_id == seller_id).all()
    if not db_products:
        return []  # Return an empty list if no products found for the seller
    return db_products

def create_product(db: Session, product: schemas.ProductCreate, seller_id: int):
    if product.min_price is None or product.min_price < 0:
        product.min_price = product.startprice * .8  # Default to startprice if min_price is not provided or invalid
    if product.max_price is None or product.max_price < 0:
        product.max_price = product.startprice * 1.2
    if product.min_price is not None and product.max_price is not None and product.min_price > product.max_price:
        raise ValueError("Minimum price cannot be greater than maximum price")
    current_price = product.startprice  # Set the current price to startprice initially
    db_product = model.Product(name=product.name,
                                startprice=product.startprice,
                                min_price=product.min_price,
                                max_price=product.max_price,
                                quantity=product.quantity,
                                description=product.description,
                                seller_id=seller_id,  # Set the seller_id for the product
                                current_price=current_price  # Set the initial current price
                                )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product: schemas.ProductCreate):
    db_product = db.query(model.Product).filter(model.Product.id == product_id).first()
    if not db_product:
        return None  # Return None if the product does not exist

    # Update the product's attributes
    db_product.name = product.name
    db_product.min_price = product.min_price
    db_product.max_price = product.max_price
    db_product.startprice = product.startprice  # Ensure startprice is updated
    db_product.quantity = product.quantity
    db_product.description = product.description

    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = db.query(model.Product).filter(model.Product.id == product_id).first()
    if not db_product:
        return None  # Return None if the product does not exist

    # Delete the product
    db.delete(db_product)
    db.commit()
    return db_product  # Optionally return the deleted product for confirmation

def create_user(db: Session, user: schemas.UserCreate):
    db_user = model.User(username=user.username,
                        email=user.email,
                        password_hash=user.password
                        )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_username(db: Session, username: str):
    db_user = db.query(model.User).filter(model.User.username == username).first()
    return db_user

def get_user_by_email(db: Session, email: str):
    db_user = db.query(model.User).filter(model.User.email == email).first()
    return db_user

def update_user(db: Session, user_id: int, user: schemas.UserCreate):
    db_user = db.query(model.User).filter(model.User.id == user_id).first()
    if not db_user:
        return None  # Return None if the user does not exist

    # Update the user's attributes
    db_user.username = user.username
    db_user.email = user.email
    db_user.password = user.password  # Note: Password should be hashed before storing in a real application

    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = db.query(model.User).filter(model.User.id == user_id).first()
    if not db_user:
        return None  # Return None if the user does not exist

    # Delete the user
    db.delete(db_user)
    db.commit()
    return db_user  # Optionally return the deleted user for confirmation

def get_user_by_id(db: Session, user_id: int):
    db_user = db.query(model.User).filter(model.User.id == user_id).first()

def create_transaction(db: Session, transaction: schemas.TransactionCreate):
    # Fetch the product and buyer from the database
    db_product = db.query(model.Product).filter(model.Product.id == transaction.product_id).first()
    if not db_product:
        raise ValueError("Product not found")
    # Ensure the buyer exists (assuming buyer_id is a user id)
    db_buyer = db.query(model.User).filter(model.User.id == transaction.buyer_id).first()
    if not db_buyer:
        raise ValueError("Buyer not found")
    # Ensure the quantity sold does not exceed available stock
    if transaction.quantity_sold <= 0:
        raise ValueError("Quantity sold must be greater than zero")
    if transaction.quantity_sold > db_product.quantity:
        raise ValueError("Cannot sell more than available stock")
    
    #Calculate the total price for the transaction
    total_price = db_product.current_price * transaction.quantity_sold
    
    # Create a new sales data entry
    db_transaction = model.SalesData(
        product_id=transaction.product_id,
        buyer_id=transaction.buyer_id,
        quantity_sold=transaction.quantity_sold,
        price = db_product.current_price,  # Current price of the product at the time of sale
        total_price=total_price  # Total price for the transaction
    )

    # Update product's sold quantity
    db_product.sold_quantity += transaction.quantity_sold
    # Decrease the available quantity
    db_product.quantity -= transaction.quantity_sold  

    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def get_sales_data_by_product_id(db: Session, product_id: int):
    db_sales_data = db.query(model.SalesData).filter(model.SalesData.product_id == product_id).all()
    if not db_sales_data:
        return []  # Return an empty list if no sales data found
    return db_sales_data

def get_sales_data_by_buyer_id(db: Session, buyer_id: int):
    db_sales_data = db.query(model.SalesData).filter(model.SalesData.buyer_id == buyer_id).all()
    if not db_sales_data:
        return []  # Return an empty list if no sales data found for the buyer
    return db_sales_data

def create_future_discount_booking(db: Session, booking: schemas.BookingCreate):
    # Fetch the user and product from the database
    db_user = db.query(model.User).filter(model.User.id == booking.user_id).first()
    if not db_user:
        raise ValueError("User not found")
    
    db_product = db.query(model.Product).filter(model.Product.id == booking.product_id).first()
    if not db_product:
        raise ValueError("Product not found")
    
    # Create a new future discount booking
    db_booking = model.FutureDiscountBooking(
        user_id=booking.user_id,
        product_id=booking.product_id,
        locked_price=db_product.current_price  # Lock the price
    )

    db_product.saved_quantity += 1  # Increment the saved quantity for the product, if needed
    

    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def delete_future_discount_booking(db: Session, booking_id: int):
    # Fetch the booking from the database
    db_booking = db.query(model.FutureDiscountBooking).filter(model.FutureDiscountBooking.id == booking_id).first()
    if not db_booking:
        return None  # Return None if the booking does not exist
    
    # Decrement the saved quantity from the product if needed
    db_product = db.query(model.Product).filter(model.Product.id == db_booking.product_id).first()
    if db_product:
        db_product.saved_quantity -= 1

    # Delete the booking
    db.delete(db_booking)
    db.commit()
    return db_booking  # Optionally return the deleted booking for confirmation

def get_future_discount_bookings_by_user_id(db: Session, user_id: int):
    db_bookings = db.query(model.FutureDiscountBooking).filter(model.FutureDiscountBooking.user_id == user_id).all()
    if not db_bookings:
        return []  # Return an empty list if no bookings found
    return db_bookings

def change_booking_status(db: Session, booking_id: int, new_status: str):
    # Fetch the booking from the database
    db_booking = db.query(model.FutureDiscountBooking).filter(model.FutureDiscountBooking.id == booking_id).first()
    if not db_booking:
        raise ValueError("Booking not found")
    
    # Update the status of the booking
    db_booking.status = new_status

    # If the status is 'fulfilled', decrement the saved quantity from the product
    db_product = db.query(model.Product).filter(model.Product.id == db_booking.product_id).first()
    if new_status == 'fulfilled' or new_status == 'expired':
        db_product.saved_quantity -= 1

    db.commit()
    db.refresh(db_booking)
    return db_booking

def get_booking_by_id(db: Session, booking_id: int):
    db_booking = db.query(model.FutureDiscountBooking).filter(model.FutureDiscountBooking.id == booking_id).first()
    if not db_booking:
        return None  # Return None if no booking found
    return db_booking

def create_price_change(db: Session, price_change: schemas.PriceChangeCreate):
    # Fetch the product from the database
    db_product = db.query(model.Product).filter(model.Product.id == price_change.product_id).first()
    if not db_product:
        raise ValueError("Product not found")
    
    # Store the old price before updating
    old_price = db_product.current_price
    
    # Update the product's current price
    db_product.current_price = price_change.new_price

    # Create a pricing history entry
    db_pricing_history = model.PricingHistory(
        product_id=db_product.id,
        old_price=old_price,
        new_price=price_change.new_price
    )

    db.add(db_pricing_history)
    db.commit()
    db.refresh(db_pricing_history)
    
    return db_pricing_history

def get_pricing_history_by_product_id(db: Session, product_id: int):
    db_pricing_history = db.query(model.PricingHistory).filter(model.PricingHistory.product_id == product_id).all()
    if not db_pricing_history:
        return []  # Return an empty list if no pricing history found
    return db_pricing_history
