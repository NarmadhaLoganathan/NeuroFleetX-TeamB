package com.neurofleetx.service;

import com.neurofleetx.dto.PredictRequestDto;
import com.neurofleetx.dto.PredictResponseDto;
import com.neurofleetx.entity.TrafficData;
import com.neurofleetx.repository.TrafficRepository;
import com.neurofleetx.util.LocationResolver;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AIService {

    private final RestTemplate restTemplate;
    private final LocationResolver locationResolver;

    private final String ML_CONGESTION_URL = "http://localhost:8000/predict";
    private final String PY_ROUTE_URL = "http://localhost:8000/api/ai/suggest-route";

    @Autowired
    private TrafficRepository trafficRepository;

    @Autowired
    public AIService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.locationResolver = new LocationResolver(restTemplate);
    }

    // ------------------------------------------------------------------
    // 1. Predict Congestion
    // ------------------------------------------------------------------
    public PredictResponseDto predictForLocation(String location) {

        double[] latlon = locationResolver.getLatLonForLocation(location);

        if (latlon == null) {
            PredictResponseDto r = new PredictResponseDto();
            r.setPredicted_vehicles(-1);
            r.setCongestion_level("UNKNOWN_LOCATION");
            return r;
        }

        double lat = latlon[0];
        double lon = latlon[1];

        long junctionId = locationResolver.latLonToGridId(lat, lon);

        double current = getCurrentVehiclesForJunction(junctionId);
        double lag1 = getLagForJunction(junctionId, 1);
        double lag2 = getLagForJunction(junctionId, 2);
        double lag3 = getLagForJunction(junctionId, 3);

        PredictRequestDto req = new PredictRequestDto(current, lag1, lag2, lag3, junctionId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<PredictRequestDto> requestEntity = new HttpEntity<>(req, headers);
        ResponseEntity<PredictResponseDto> resp = restTemplate.postForEntity(ML_CONGESTION_URL, requestEntity,
                PredictResponseDto.class);

        if (resp.getStatusCode() == HttpStatus.OK && resp.getBody() != null)
            return resp.getBody();

        PredictResponseDto r = new PredictResponseDto();
        r.setPredicted_vehicles(-1);
        r.setCongestion_level("ERROR");
        return r;
    }

    private double getCurrentVehiclesForJunction(long id) {
        return 25.0;
    }

    private double getLagForJunction(long id, int h) {
        if (h == 1)
            return 22.0;
        if (h == 2)
            return 20.0;
        if (h == 3)
            return 18.0;
        return 20.0;
    }

    // ------------------------------------------------------------------
    // 2. Route Suggestion (Python)
    // ------------------------------------------------------------------
    public Object getSuggestedRoute(String start, String end, String vehicleId) {
        String url = PY_ROUTE_URL + "?start_place=" + start + "&end_place=" + end;

        ResponseEntity<Object> resp = restTemplate.getForEntity(url, Object.class);

        if (resp.getStatusCode() == HttpStatus.OK)
            return resp.getBody();

        Map<String, Object> errorMap = new HashMap<>();
        errorMap.put("success", false);
        errorMap.put("error", "Route API call failed");
        return errorMap;
    }

    // ------------------------------------------------------------------
    // 3. Risk Zone Logic (Option 1 Full Fix)
    // ------------------------------------------------------------------
    public List<Map<String, Object>> getRiskZones() {

        List<TrafficData> all = trafficRepository.findAll();
        if (all.isEmpty()) {
            return Collections.emptyList();
        }

        // Latest TrafficData for each location
        Map<String, TrafficData> latest = new HashMap<>();

        for (TrafficData t : all) {
            if (t.getLocation() == null)
                continue;

            TrafficData prev = latest.get(t.getLocation());

            if (prev == null ||
                    (t.getTimestamp() != null && prev.getTimestamp() != null &&
                            t.getTimestamp().isAfter(prev.getTimestamp()))) {

                latest.put(t.getLocation(), t);
            }
        }

        // Build final list with lat/lon included
        return latest.values()
                .stream()
                .map(t -> {
                    Map<String, Object> map = new HashMap<>();
                    int density = (t.getVehicleDensity() == null ? 0 : t.getVehicleDensity());

                    map.put("location", t.getLocation());
                    map.put("density", density);
                    map.put("riskLevel", computeRiskLevel(density));

                    // ⭐ IMPORTANT: Add latitude & longitude for the map
                    map.put("latitude", t.getLatitude());
                    map.put("longitude", t.getLongitude());

                    return map;
                })
                .sorted((a, b) -> ((Integer) b.get("density")) - ((Integer) a.get("density")))
                .collect(Collectors.toList());
    }

    private String computeRiskLevel(int density) {
        if (density >= 80)
            return "HIGH";
        if (density >= 50)
            return "MEDIUM";
        return "LOW";
    }

    // ------------------------------------------------------------------
    // NEW: Driver Support Chatbot Logic
    // ------------------------------------------------------------------
    

    // ------------------------------------------------------------------
    // 4. Maintenance Prediction (Mock Logic)
    // ------------------------------------------------------------------
    public com.neurofleetx.dto.MaintenancePredictionDTO predictMaintenance(Long vehicleId) {
        // In a real app, we would fetch vehicle mileage, logs, and use ML.
        // For now, we return a mock prediction or basic logic.

        // Mock logic:
        int nextServiceKm = 5000;
        String urgency = "LOW";
        String recommendation = "Routine checkup due in 5000 km.";

        // Randomize slightly for demo effect
        if (vehicleId % 2 == 0) {
            nextServiceKm = 1200;
            urgency = "MEDIUM";
            recommendation = "Brake inspection recommended soon.";
        }

        return new com.neurofleetx.dto.MaintenancePredictionDTO(nextServiceKm, urgency, recommendation);
    }
}
