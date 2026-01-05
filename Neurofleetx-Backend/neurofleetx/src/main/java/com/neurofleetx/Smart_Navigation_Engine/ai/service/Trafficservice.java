package com.neurofleetx.Smart_Navigation_Engine.ai.service;

import org.springframework.stereotype.Service;

@Service
public class Trafficservice {

    public double getTrafficScore(double startLat, double startLng, double endLat, double endLng) {

        // Simple heuristic example (You can improve later)
        double distanceKm = haversine(startLat, startLng, endLat, endLng);

        // Assume normal speed = 60 km/h
        double expectedTime = distanceKm / 60.0 * 3600; // seconds

        // Random multiplier to simulate traffic (replace with real API later)
        double congestionFactor = Math.random() * 2;  // range 0–2

        double actualTime = expectedTime * congestionFactor;

        // score = actualTime / (2 * expectedTime)
        double score = actualTime / (expectedTime * 2);

        return Math.min(1.0, score); // bound 0–1
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371; // km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
}
