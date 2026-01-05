package com.neurofleetx.service;

import com.neurofleetx.entity.CongestionLevel;
import com.neurofleetx.entity.TrafficData;
import com.neurofleetx.repository.TrafficRepository;
import com.neurofleetx.util.LocationResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class TrafficService {

    @Autowired
    private TrafficRepository trafficRepository;

    @Autowired
    private RestTemplate restTemplate;

    public List<TrafficData> getAllTrafficData() {
        return trafficRepository.findAll();
    }

    public TrafficData createTrafficData(TrafficData trafficData) {
        // Let @PrePersist set timestamp automatically if present
        if (trafficData.getTimestamp() == null) {
            trafficData.setTimestamp(LocalDateTime.now(ZoneId.of("Asia/Kolkata")));
        }
        return trafficRepository.save(trafficData);
    }

    public List<TrafficData> getTrafficByLocation(String location) {
        return trafficRepository.findByLocationOrderByTimestampDesc(location);
    }

    // ⭐ NEW: Create traffic data by location name
    public TrafficData createTrafficDataByLocation(
            String location,
            Integer vehicleDensity,
            Double avgSpeed
    ) {

        LocationResolver resolver = new LocationResolver(restTemplate);

        double[] latLon = resolver.getLatLonForLocation(location);
        if (latLon == null) {
            throw new RuntimeException("❌ Could not resolve location: " + location);
        }

        double lat = latLon[0];
        double lon = latLon[1];

        String level = determineCongestionLevel(vehicleDensity);

        TrafficData data = new TrafficData();
        data.setLocation(location);
        data.setLatitude(lat);
        data.setLongitude(lon);
        data.setVehicleDensity(vehicleDensity);
        data.setAvgSpeed(avgSpeed);
        data.setCongestionLevel(CongestionLevel.valueOf(level));

        // ⭐ Correct timestamp format (IST)
        data.setTimestamp(LocalDateTime.now(ZoneId.of("Asia/Kolkata")));

        TrafficData saved = trafficRepository.save(data);

        System.out.println("✅ Traffic Data Created: " + location +
                " [Lat: " + lat + ", Lon: " + lon + "]" +
                " | Density: " + vehicleDensity +
                " | Level: " + level);

        return saved;
    }

    private String determineCongestionLevel(Integer vehicleDensity) {
        if (vehicleDensity == null) return "LOW";
        if (vehicleDensity >= 80) return "CRITICAL";
        if (vehicleDensity >= 60) return "HIGH";
        if (vehicleDensity >= 30) return "MEDIUM";
        return "LOW";
    }

    // ⭐ NEW: Update traffic data
    public TrafficData updateTrafficData(Long id, Integer vehicleDensity, Double avgSpeed) {

        TrafficData existing = trafficRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Traffic data not found"));

        if (vehicleDensity != null) {
            existing.setVehicleDensity(vehicleDensity);
            existing.setCongestionLevel(
                    CongestionLevel.valueOf(determineCongestionLevel(vehicleDensity))
            );
        }

        if (avgSpeed != null) {
            existing.setAvgSpeed(avgSpeed);
        }

        // ⭐ Correct IST Time
        existing.setTimestamp(LocalDateTime.now(ZoneId.of("Asia/Kolkata")));

        return trafficRepository.save(existing);
    }

    // ⭐ NEW: Delete
    public void deleteTrafficData(Long id) {
        if (!trafficRepository.existsById(id)) {
            throw new RuntimeException("Traffic data not found");
        }
        trafficRepository.deleteById(id);
    }

    // ⭐ NEW: Recent 24 hours (LocalDateTime version)
    public List<TrafficData> getRecentTrafficData() {
        LocalDateTime yesterday = LocalDateTime.now(ZoneId.of("Asia/Kolkata")).minusHours(24);

        return trafficRepository.findByTimestampGreaterThanOrderByTimestampDesc(yesterday);
    }
}
