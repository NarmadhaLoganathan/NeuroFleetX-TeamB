import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib
import os

df = pd.read_csv("data/vehicles.csv")

# Predict km left before maintenance
df["km_left"] = 50000 - (df["totalDistance"] % 50000)

X = df[["totalDistance"]]
y = df["km_left"]

model = LinearRegression()
model.fit(X, y)

os.makedirs("models", exist_ok=True)
joblib.dump(model, "models/maintenance_model.pkl")

print("maintenance_model.pkl created!")
