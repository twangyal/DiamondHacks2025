from pydantic import BaseModel

# Define a Pydantic model for Product creation
class ProductCreate(BaseModel):
    name: str
    price: float

    class Config:
        orm_mode = True  # This allows Pydantic to work with SQLAlchemy models
