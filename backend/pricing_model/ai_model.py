import pandas as pd
import numpy as np
import joblib

# Load the trained model
model = joblib.load('./pricing_model/price_optimization_model.pkl')

# Function to calculate the optimal price for each product using the trained model
def calculate_optimal_price(product):
    """Predict the optimal price using the trained model."""
    # Extract relevant features from the product data
    features = np.array([[
        product.startprice,  # Start price
        product.quantity,  # Current quantity in stock
        product.volume,
        product.sold_quantity,  # Number of items sold
        product.saved_quantity,  # Quantity saved (if applicable)
        product.min_price if product.min_price is not None else product.startprice*.5,  # Ensure min_price is not None
        product.max_price if product.max_price is not None else product.startprice*1.5  # Ensure max_price is not None
    ]])
    
    # Predict the optimal price
    optimal_price = model.predict(features)[0]
    
    # Ensure the price stays within the bounds (min_price and max_price)
    optimal_price = max(product.min_price, min(optimal_price, product.max_price))

    #trucate to 2 decimal places for currency formatting
    optimal_price = round(optimal_price, 2)
    
    return optimal_price

