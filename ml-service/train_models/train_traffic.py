import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib
import os

CSV_PATH = "datasets/traffic.csv"

df = pd.read_csv(CSV_PATH)
df = df.dropna()

df["date_time"] = pd.to_datetime(df["date_time"], errors='coerce')
df["hour"] = df["date_time"].dt.hour
df["dayofweek"] = df["date_time"].dt.dayofweek

def label_congestion(volume):
    if volume < 3000: return "LOW"
    if volume < 5000: return "MEDIUM"
    return "HIGH"

df["congestion"] = df["traffic_volume"].apply(label_congestion)

X = df[["temp", "rain_1h", "snow_1h", "clouds_all", "hour", "dayofweek"]]
y = df["congestion"]

le = LabelEncoder()
y_enc = le.fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(
    X, y_enc, test_size=0.2, random_state=42
)

model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

pred = model.predict(X_test)
print(classification_report(y_test, pred))

os.makedirs("models", exist_ok=True)
joblib.dump(model, "models/traffic_model.pkl")
joblib.dump(le, "models/traffic_encoder.pkl")

print("Traffic ML Model Saved!")
