import pandas as pd
import joblib
import os

# Load ML model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../models/traffic_model.pkl")
model = joblib.load(MODEL_PATH)

DATA_PATH = os.path.join(os.path.dirname(__file__), "../data/traffic.csv")
df = pd.read_csv(DATA_PATH)

def predict_traffic(location: str):
    """Return LOW / MEDIUM / HIGH prediction."""
    # Simple simulation: find average density
    subset = df[df["location"] == location]

    if subset.empty:
        return "LOW"

    avg = subset["vehicleDensity"].mean()

    if avg > 80:
        return "HIGH"
    elif avg > 40:
        return "MEDIUM"
    return "LOW"
