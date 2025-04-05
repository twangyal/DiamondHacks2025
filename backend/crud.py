from sqlalchemy.orm import Session
from . import models, schemas

# Get all products
def get_products(db: Session):
    return db.query(models.Product).all()

# Create a new product
def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(name=product.name, price=product.price)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product
