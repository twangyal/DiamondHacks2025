from pydantic import BaseModel

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
    description: str = None  # Optional description field

    class Config:
        from_attributes = True

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

class BookingCreate(BaseModel):
    product_id: int
    user_id: int
    class Config:
        from_attributes = True

class PriceChangeCreate(BaseModel):
    product_id: int
    new_price: float

    class Config:
        from_attributes = True