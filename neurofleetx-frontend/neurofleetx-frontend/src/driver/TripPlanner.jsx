import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { toast, ToastContainer } from "react-toastify";

const AVG_SPEED = 40; // km/hr

const TripPlanner = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const navigate = useNavigate();

  const getLatLngFromPlace = async (place) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        place
      )}`
    );
    const data = await res.json();
    if (!data.length) throw new Error("Location not found");
    return { lat: +data[0].lat, lng: +data[0].lon };
  };

  const getDistanceKm = (a, b) => {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLon = ((b.lng - a.lng) * Math.PI) / 180;
    const lat1 = (a.lat * Math.PI) / 180;
    const lat2 = (b.lat * Math.PI) / 180;

    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(dLon / 2) ** 2;

    return 2 * R * Math.asin(Math.sqrt(h));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const src = await getLatLngFromPlace(source);
      const dest = await getLatLngFromPlace(destination);

      const distance = getDistanceKm(src, dest).toFixed(2);
      const eta = ((distance / AVG_SPEED) * 60).toFixed(0); // minutes

      const gpsLogs = [
        { latitude: src.lat, longitude: src.lng },
        { latitude: dest.lat, longitude: dest.lng },
      ];

      navigate("/driver/gps", {
        state: {
          startLocation: source,
          endLocation: destination,
          distance,
          eta,
          gpsLogs,
        },
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Layout>
      <ToastContainer />
      <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
        <h2 className="text-xl font-bold mb-4 text-center">
          Trip Planner
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            placeholder="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
          <input
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
          <button className="w-full bg-blue-600 text-white py-3 rounded">
            Start Trip
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default TripPlanner;
