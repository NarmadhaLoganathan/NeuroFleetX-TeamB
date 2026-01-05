package com.neurofleetx.controller;

import com.neurofleetx.dto.FleetStatusDTO;
import com.neurofleetx.entity.GpsLog;
import com.neurofleetx.service.GpsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gps")
@CrossOrigin("*")
public class GpsController {

    @Autowired
    private GpsService gpsService;

    // ======================================================
    // 1️⃣ VEHICLE-BASED GPS LOG (existing / hardware GPS)
    // Used for fleet tracking, admin live map
    // ======================================================
    @PostMapping("/log")
    public ResponseEntity<GpsLog> logGps(
            @RequestParam Long vehicleId,
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam Double speed
    ) {
        return ResponseEntity.ok(
                gpsService.createGpsLog(vehicleId, latitude, longitude, speed)
        );
    }

    // ======================================================
    // 2️⃣ TRIP-BASED GPS LOG (NEW – for active trips)
    // Used by driver GPS logger
    // ======================================================
    @PostMapping("/trip/log")
    public ResponseEntity<GpsLog> logTripGps(
            @RequestParam Long tripId,
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam Double speed
    ) {
        return ResponseEntity.ok(
                gpsService.createGpsLogForTrip(tripId, latitude, longitude, speed)
        );
    }

    // ======================================================
    // 3️⃣ MANUAL LOCATION LOGGING (text-based)
    // Used by driver check-in / demo
    // ======================================================
    @PostMapping("/log-location")
    public ResponseEntity<?> logLocationByName(
            @RequestParam String registrationNo,
            @RequestParam String location,
            @RequestParam Double speed
    ) {
        try {
            return ResponseEntity.ok(
                    gpsService.createLogByText(registrationNo, location, speed)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ======================================================
    // 4️⃣ GET GPS HISTORY FOR A VEHICLE
    // Used by vehicle status & admin
    // ======================================================
    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<GpsLog>> getVehicleGpsLogs(
            @PathVariable Long vehicleId
    ) {
        return ResponseEntity.ok(
                gpsService.getVehicleLocation(vehicleId)
        );
    }

    // ======================================================
    // 5️⃣ GET GPS HISTORY FOR A TRIP (NEW)
    // Used by trip summary page
    // ======================================================
    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<GpsLog>> getTripGpsLogs(
            @PathVariable Long tripId
    ) {
        return ResponseEntity.ok(
                gpsService.getGpsLogsByTrip(tripId)
        );
    }

    // ======================================================
    // 6️⃣ FLEET LIVE STATUS (admin dashboard)
    // ======================================================
    @GetMapping("/fleet-live")
    public ResponseEntity<List<FleetStatusDTO>> getFleetLiveStatus() {
        return ResponseEntity.ok(
                gpsService.getFleetStatus()
        );
    }
}
