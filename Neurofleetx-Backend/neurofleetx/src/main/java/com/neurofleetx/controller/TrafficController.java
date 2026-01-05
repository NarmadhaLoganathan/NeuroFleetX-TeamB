package com.neurofleetx.controller;

import com.neurofleetx.dto.TrafficCreateRequest;
import com.neurofleetx.entity.TrafficData;
import com.neurofleetx.service.TrafficService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/traffic")
@CrossOrigin("*")
public class TrafficController {

    @Autowired
    private TrafficService trafficService;

    @GetMapping
    public ResponseEntity<List<TrafficData>> getAllTraffic() {
        return ResponseEntity.ok(trafficService.getAllTrafficData());
    }

    // ⭐ NEW: Get recent traffic (last 24 hours)
    @GetMapping("/recent")
    public ResponseEntity<List<TrafficData>> getRecentTraffic() {
        return ResponseEntity.ok(trafficService.getRecentTrafficData());
    }

    @PostMapping
    public ResponseEntity<TrafficData> createTrafficData(@RequestBody TrafficData trafficData) {
        return ResponseEntity.ok(trafficService.createTrafficData(trafficData));
    }

    // ⭐ NEW: Create traffic data by location name
    @PostMapping("/by-location")
    public ResponseEntity<?> createTrafficByLocation(@RequestBody TrafficCreateRequest request) {
        try {
            TrafficData created = trafficService.createTrafficDataByLocation(
                    request.getLocation(),
                    request.getVehicleDensity(),
                    request.getAvgSpeed()
            );
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ⭐ NEW: Update traffic data
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTrafficData(
            @PathVariable Long id,
            @RequestBody TrafficCreateRequest request
    ) {
        try {
            TrafficData updated = trafficService.updateTrafficData(
                    id,
                    request.getVehicleDensity(),
                    request.getAvgSpeed()
            );
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ⭐ NEW: Delete traffic data
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrafficData(@PathVariable Long id) {
        try {
            trafficService.deleteTrafficData(id);
            return ResponseEntity.ok(Map.of("message", "Traffic data deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/location")
    public ResponseEntity<List<TrafficData>> getTrafficByLocation(@RequestParam String location) {
        return ResponseEntity.ok(trafficService.getTrafficByLocation(location));
    }
}
