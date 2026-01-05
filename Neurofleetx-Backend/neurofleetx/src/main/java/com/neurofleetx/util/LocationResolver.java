package com.neurofleetx.util;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class LocationResolver {

    private final RestTemplate restTemplate;

    public LocationResolver(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Query Nominatim OpenStreetMap for coordinates of a free-text location.
     * Returns double[]{lat, lon} or null if not found.
     */
    public double[] getLatLonForLocation(String location) {
        try {
            // 1. Encode the location (e.g., "New York" -> "New+York")
            String encodedLocation = URLEncoder.encode(location, StandardCharsets.UTF_8);

            String url =
                    "https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q="
                            + encodedLocation;

            // 2. Set Headers (Crucial: Nominatim blocks generic agents)
            HttpHeaders headers = new HttpHeaders();
            // Using a specific User-Agent for the student project to avoid blocking
            headers.set("User-Agent", "NeuroFleetX_StudentProject/1.0 (neurofleet_test@gmail.com)");
            headers.set("Accept", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            // 3. Execute Request
            ResponseEntity<String> resp =
                    restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            if (!resp.getStatusCode().is2xxSuccessful()) {
                System.out.println("❌ Nominatim API Error: " + resp.getStatusCode());
                return null;
            }

            // 4. Parse Response
            JSONArray arr = new JSONArray(resp.getBody());

            if (arr.length() == 0) {
                System.out.println("❌ No coordinates found for location: " + location);
                return null;
            }

            JSONObject obj = arr.getJSONObject(0);
            double lat = obj.getDouble("lat");
            double lon = obj.getDouble("lon");

            System.out.println("✅ Resolved: " + location + " -> " + lat + ", " + lon);
            return new double[]{lat, lon};

        } catch (Exception e) {
            System.err.println("❌ Geocoding Exception: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    public long latLonToGridId(double lat, double lon) {
        double gridResolution = 0.05;
        long latIndex = Math.round(Math.floor(lat / gridResolution));
        long lonIndex = Math.round(Math.floor(lon / gridResolution));
        long id = latIndex * 1_000_000L + (lonIndex & 0xFFFFFL);
        return id;
    }
}