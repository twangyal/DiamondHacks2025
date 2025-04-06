import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib

# Load the dataset
df = pd.read_csv('products_datasets.csv')

# Define features (X) and target (y)
X = df[['start_price', 'quantity', 'volume_per_month', 'sold', 'saved', 'min_price', 'max_price']]
y = df['current_price']  # Target variable (optimal price)

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model (Random Forest Regressor in this case)
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save the trained model
joblib.dump(model, 'price_optimization_model.pkl')
