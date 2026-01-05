package com.neurofleetx.controller;

import com.neurofleetx.dto.TripCreateDTO;
import com.neurofleetx.entity.Trip;
import com.neurofleetx.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin("*")
public class TripController {

    @Autowired
    private TripService tripService;

    @GetMapping
    public ResponseEntity<List<Trip>> getAllTrips() {
        return ResponseEntity.ok(tripService.getAllTrips());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.getTripById(id));
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<Trip>> getTripsByDriver(@PathVariable Long driverId) {
        return ResponseEntity.ok(tripService.getTripsByDriver(driverId));
    }

    @PostMapping
    public ResponseEntity<Trip> createTrip(@RequestBody TripCreateDTO dto) {
        return ResponseEntity.ok(tripService.createTrip(dto));
    }

    // --- NEW: Full Update Endpoint (Using TripCreateDTO for update payload) ---
    @PutMapping("/{id}")
    public ResponseEntity<Trip> updateTrip(@PathVariable Long id, @RequestBody TripCreateDTO dto) {
        return ResponseEntity.ok(tripService.updateTrip(id, dto));
    }

    // --- Existing: Status Update Endpoint (Specific) ---
    @PutMapping("/{id}/status")
    public ResponseEntity<Trip> updateTripStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(tripService.updateTripStatus(id, status));
    }

    // --- NEW: Delete Endpoint ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/end")
    public ResponseEntity<Trip> endTrip(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "0.0") Double distance) {
        return ResponseEntity.ok(tripService.endTrip(id, distance));
    }

    @GetMapping("/active/{userId}")
    public ResponseEntity<Trip> getActiveTrip(@PathVariable Long userId) {
        return ResponseEntity.ok(tripService.getActiveTrip(userId));
    }
}
