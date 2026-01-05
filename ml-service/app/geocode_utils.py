# geocode_utils.py
import requests

def geocode_place(place: str):
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": place + ", Coimbatore",
        "format": "json",
        "limit": 1
    }

    res = requests.get(url, params=params, headers={"User-Agent": "NeuroFleetX-Client"})
    data = res.json()

    if not data:
        raise Exception("Place not found")

    return {
        "lat": float(data[0]["lat"]),
        "lon": float(data[0]["lon"])
    }
