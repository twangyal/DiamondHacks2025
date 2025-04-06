from sqlalchemy import Column, Integer, String, DECIMAL, ForeignKey, TIMESTAMP, Text
import datetime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Product(Base):
    __tablename__ = 'products'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100))
    startprice = Column(DECIMAL)
    quantity = Column(Integer, default=0)
    saved_quantity = Column(Integer, default=0)
    sold_quantity = Column(Integer, default=0)
    min_price = Column(DECIMAL, nullable=True)
    max_price = Column(DECIMAL, nullable=True)
    volume = Column(Integer, default=0)
    current_price = Column(DECIMAL, nullable=True)
    description = Column(String(255), nullable=True)
    seller_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    future_discount_bookings = relationship("FutureDiscountBooking", back_populates="product", cascade="all, delete-orphan")
    pricing_history = relationship("PricingHistory", back_populates="product", cascade="all, delete-orphan")
    seller = relationship("User", back_populates="products")
    sales_data = relationship("SalesData", back_populates="product", cascade="all, delete-orphan")


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(100), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    future_discount_bookings = relationship("FutureDiscountBooking", back_populates="buyers", cascade="all, delete-orphan")
    products = relationship("Product", back_populates="seller", cascade="all, delete-orphan")
    transactions = relationship("SalesData", back_populates="buyer", cascade="all, delete-orphan")

class PricingHistory(Base):
    __tablename__ = 'pricing_history'

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey('products.id', ondelete='CASCADE'))
    old_price = Column(DECIMAL, nullable=False)
    new_price = Column(DECIMAL, nullable=False)
    changed_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)

    product = relationship("Product", back_populates="pricing_history")

class SalesData(Base):
    __tablename__ = 'sales_data'

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey('products.id', ondelete='CASCADE'))
    buyer_id = Column(Integer, ForeignKey('users.id'))
    quantity_sold = Column(Integer, nullable=False)
    total_price = Column(DECIMAL, nullable=False)
    sold_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)

    product = relationship("Product", back_populates="sales_data")
    buyer = relationship("User", back_populates="transactions")

class FutureDiscountBooking(Base):
    __tablename__ = 'future_discount_bookings'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    product_id = Column(Integer, ForeignKey('products.id', ondelete='CASCADE'))
    locked_price = Column(DECIMAL, nullable=False)
    booked_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)
    status = Column(String(50), default='active')  # active, fulfilled, expired
    fulfilled_at = Column(TIMESTAMP, nullable=True)

    buyers = relationship("User", back_populates="future_discount_bookings")
    product = relationship("Product", back_populates="future_discount_bookings")
