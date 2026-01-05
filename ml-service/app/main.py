# main.py
from fastapi import FastAPI, HTTPException
from app.route_ai import compute_route_global
from app.geocode_utils import geocode_place

app = FastAPI()

@app.get("/api/ai/suggest-route")
def api_route(start_place: str, end_place: str):
    try:
        s = geocode_place(start_place)
        e = geocode_place(end_place)

        return compute_route_global(
            s["lat"], s["lon"],
            e["lat"], e["lon"]
        )
    except Exception as ex:
        raise HTTPException(status_code=500, detail=str(ex))
