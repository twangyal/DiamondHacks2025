from pydantic import BaseModel
from typing import Optional


class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    username: str
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str = None

class ProductCreate(BaseModel):
    name: str
    startprice: float
    quantity: int = 1  # Default quantity to 1 if not provided
    min_price: float = None  # Optional minimum price for dynamic pricing
    max_price: float = None  # Optional maximum price for dynamic pricing
    description: Optional[str] = None  # Make description optional

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

    class Config:
        from_attributes = True

class TransactionCreate(BaseModel):
    product_id: int
    buyer_id: int
    quantity_sold: int

    class Config:
        from_attributes = True

class TransactionResponse(BaseModel):
    product_name: str
    quantity_sold: int
    price : float  # The price at which the product was sold
    total_price: float
    sold_at: str  # ISO format date string

    class Config:
        from_attributes = True


class BookingCreate(BaseModel):
    product_id: int
    user_id: int
    class Config:
        from_attributes = True

class BookingResponse(BaseModel):
    booking_id: int
    name: str
    locked_price: float
    current_price: float
    quantity: int
    bookingdate: str 

class PriceChangeCreate(BaseModel):
    product_id: int
    new_price: float

    class Config:
        from_attributes = True