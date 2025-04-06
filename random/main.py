from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib

# Load the trained model
model = joblib.load('price_optimization_model.pkl')

# Function to calculate the optimal price for each product using the trained model
def calculate_optimal_price(product):
    """Predict the optimal price using the trained model."""
    # Extract relevant features from the product data
    features = np.array([[
        product['start_price'],
        product['quantity'],
        product['volume_per_month'],
        product['sold'],
        product['saved'],
        product['min_price'],
        product['max_price']
    ]])
    
    # Predict the optimal price
    optimal_price = model.predict(features)[0]
    
    # Ensure the price stays within the bounds (min_price and max_price)
    optimal_price = max(product['min_price'], min(optimal_price, product['max_price']))
    
    return optimal_price

# Initialize FastAPI app
app = FastAPI()

# Pydantic model to define the structure of the request body
class ProductData(BaseModel):
    name: str
    start_price: float
    quantity: int
    volume_per_month: int
    sold: int
    saved: int
    max_price: float
    min_price: float
    current_price: float
    category: str
    current_time: str

# POST endpoint to predict the optimal price
@app.post("/predict-price/")
def predict_price(data: ProductData):
    # Convert the product data into a dictionary
    product_data = data.dict()
    
    # Calculate the optimal price using the trained model
    optimal_price = calculate_optimal_price(product_data)
    
    # Return the optimal price for the product
    return {"name": product_data['name'], "optimal_price": optimal_price}

# Run FastAPI (you can do this with `uvicorn main:app --reload` in the terminal)
