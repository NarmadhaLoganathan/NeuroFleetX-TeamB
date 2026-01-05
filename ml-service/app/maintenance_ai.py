def predict_maintenance(vehicleId: int):
    next_service_km = 50000 - (vehicleId * 123) % 50000
    return {
        "vehicleId": vehicleId,
        "nextServiceKm": next_service_km,
        "urgency": "LOW" if next_service_km > 10000 else "HIGH"
    }
