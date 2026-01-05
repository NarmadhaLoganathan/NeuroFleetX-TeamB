// package com.neurofleetx.service;

// import com.neurofleetx.dto.FleetStatusDTO;
// import com.neurofleetx.entity.GpsLog;
// import com.neurofleetx.entity.Vehicle;
// import com.neurofleetx.repository.GpsRepository;
// import com.neurofleetx.repository.VehicleRepository;
// import com.neurofleetx.util.LocationResolver; // Import your existing utility
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import org.springframework.web.client.RestTemplate; // Needed for LocationResolver

// import java.time.LocalDateTime;
// import java.util.ArrayList;
// import java.util.List;

// @Service
// public class GpsService {

//     @Autowired
//     private GpsRepository gpsRepository;

//     @Autowired
//     private VehicleRepository vehicleRepository;

//     // We need to instantiate the LocationResolver
//     private final LocationResolver locationResolver;

//     @Autowired
//     public GpsService(RestTemplate restTemplate) {
//         this.locationResolver = new LocationResolver(restTemplate);
//     }

//     public GpsLog createGpsLog(Long vehicleId, Double latitude, Double longitude, Double speed) {
//         Vehicle vehicle = vehicleRepository.findById(vehicleId)
//                 .orElseThrow(() -> new RuntimeException("Vehicle not found"));

//         GpsLog gpsLog = new GpsLog();
//         gpsLog.setVehicle(vehicle);
//         gpsLog.setLatitude(latitude);
//         gpsLog.setLongitude(longitude);
//         gpsLog.setSpeed(speed);
//         gpsLog.setTimestamp(LocalDateTime.now());

//         // Update vehicle's current location string for reference
//         // (Optional: You could reverse-geocode here, but let's keep it simple)

//         return gpsRepository.save(gpsLog);
//     }

//     // --- NEW: Log by Text Location ---
//     public GpsLog createLogByText(String registrationNo, String locationName, Double speed) {

//         // Convert text → lat/lon
//         double[] coords = locationResolver.getLatLonForLocation(locationName);

//         if (coords == null) {
//             throw new RuntimeException("Could not find coordinates for: " + locationName);
//         }

//         // Find vehicle using registrationNo
//         Vehicle vehicle = vehicleRepository.findByRegistrationNo(registrationNo);
//         if (vehicle == null) {
//             throw new RuntimeException("Vehicle with registrationNo " + registrationNo + " not found");
//         }

//         // Create log
//         GpsLog gpsLog = new GpsLog();
//         gpsLog.setVehicle(vehicle);
//         gpsLog.setLatitude(coords[0]);
//         gpsLog.setLongitude(coords[1]);
//         gpsLog.setSpeed(speed);
//         gpsLog.setTimestamp(LocalDateTime.now());

//         // update vehicle location
//         vehicle.setCurrentLocation(locationName);
//         vehicleRepository.save(vehicle);

//         return gpsRepository.save(gpsLog);
//     }


//     public List<GpsLog> getVehicleLocation(Long vehicleId) {
//         return gpsRepository.findByVehicleVehicleIdOrderByTimestampDesc(vehicleId);
//     }

//     public List<FleetStatusDTO> getFleetStatus() {
//         List<Vehicle> vehicles = vehicleRepository.findAll();
//         List<FleetStatusDTO> fleetStatus = new ArrayList<>();

//         for (Vehicle v : vehicles) {
//             GpsLog lastLog = gpsRepository.findLatestByVehicleId(v.getVehicleId());

//             if (lastLog != null) {
//                 String status = "STOPPED";
//                 if (lastLog.getSpeed() > 0 && lastLog.getSpeed() < 10) status = "IDLING";
//                 else if (lastLog.getSpeed() >= 10) status = "MOVING";

//                 fleetStatus.add(new FleetStatusDTO(
//                         v.getVehicleId(),
//                         v.getRegistrationNo(),
//                         v.getVehicleType(),
//                         v.getDriver() != null ? v.getDriver().getName() : "Unassigned",
//                         lastLog.getLatitude(),
//                         lastLog.getLongitude(),
//                         lastLog.getSpeed(),
//                         status,
//                         lastLog.getTimestamp().toString()
//                 ));
//             }
//         }
//         return fleetStatus;
//     }
// }
package com.neurofleetx.service;

import com.neurofleetx.dto.FleetStatusDTO;
import com.neurofleetx.entity.GpsLog;
import com.neurofleetx.entity.Trip;
import com.neurofleetx.entity.Vehicle;
import com.neurofleetx.repository.GpsRepository;
import com.neurofleetx.repository.TripRepository;
import com.neurofleetx.repository.VehicleRepository;
import com.neurofleetx.util.LocationResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class GpsService {

    @Autowired
    private GpsRepository gpsRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private TripRepository tripRepository;

    private final LocationResolver locationResolver;

    @Autowired
    public GpsService(RestTemplate restTemplate) {
        this.locationResolver = new LocationResolver(restTemplate);
    }

    // ======================================================
    // 1️⃣ VEHICLE-BASED GPS LOGGING (EXISTING FEATURE)
    // Used by fleet tracking, admin dashboard
    // ======================================================
    public GpsLog createGpsLog(
            Long vehicleId,
            Double latitude,
            Double longitude,
            Double speed
    ) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        GpsLog gpsLog = new GpsLog();
        gpsLog.setVehicle(vehicle);
        gpsLog.setLatitude(latitude);
        gpsLog.setLongitude(longitude);
        gpsLog.setSpeed(speed);
        gpsLog.setLoggedAt(LocalDateTime.now());

        return gpsRepository.save(gpsLog);
    }

    // ======================================================
    // 2️⃣ TRIP-BASED GPS LOGGING (NEW)
    // Used while a trip is ONGOING
    // ======================================================
    public GpsLog createGpsLogForTrip(
            Long tripId,
            Double latitude,
            Double longitude,
            Double speed
    ) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        Vehicle vehicle = trip.getVehicle();

        GpsLog gpsLog = new GpsLog();
        gpsLog.setTrip(trip);
        gpsLog.setVehicle(vehicle);
        gpsLog.setLatitude(latitude);
        gpsLog.setLongitude(longitude);
        gpsLog.setSpeed(speed);
        gpsLog.setLoggedAt(LocalDateTime.now());

        return gpsRepository.save(gpsLog);
    }

    // ======================================================
    // 3️⃣ TEXT-BASED LOCATION LOGGING
    // Used for manual check-in / demo
    // ======================================================
    public GpsLog createLogByText(
            String registrationNo,
            String locationName,
            Double speed
    ) {
        double[] coords = locationResolver.getLatLonForLocation(locationName);

        if (coords == null) {
            throw new RuntimeException("Could not find coordinates for: " + locationName);
        }

        Vehicle vehicle = vehicleRepository.findByRegistrationNo(registrationNo)
                .orElseThrow(() ->
                        new RuntimeException("Vehicle not found: " + registrationNo)
                );

        GpsLog gpsLog = new GpsLog();
        gpsLog.setVehicle(vehicle);
        gpsLog.setLatitude(coords[0]);
        gpsLog.setLongitude(coords[1]);
        gpsLog.setSpeed(speed);
        gpsLog.setLoggedAt(LocalDateTime.now());

        vehicle.setCurrentLocation(locationName);
        vehicleRepository.save(vehicle);

        return gpsRepository.save(gpsLog);
    }

    // ======================================================
    // 4️⃣ GET GPS HISTORY FOR A VEHICLE
    // ======================================================
    public List<GpsLog> getVehicleLocation(Long vehicleId) {
        return gpsRepository.findByVehicle_VehicleIdOrderByLoggedAtDesc(vehicleId);
    }

    // ======================================================
    // 5️⃣ GET GPS HISTORY FOR A TRIP
    // ======================================================
    public List<GpsLog> getGpsLogsByTrip(Long tripId) {
        return gpsRepository.findByTrip_TripIdOrderByLoggedAtAsc(tripId);
    }

    // ======================================================
    // 6️⃣ FLEET LIVE STATUS (ADMIN DASHBOARD)
    // ======================================================
    public List<FleetStatusDTO> getFleetStatus() {

        List<Vehicle> vehicles = vehicleRepository.findAll();
        List<FleetStatusDTO> fleetStatus = new ArrayList<>();

        for (Vehicle v : vehicles) {

            GpsLog lastLog = gpsRepository.findLatestByVehicleId(v.getVehicleId());
            if (lastLog == null) continue;

            String status = "STOPPED";
            if (lastLog.getSpeed() > 0 && lastLog.getSpeed() < 10) {
                status = "IDLING";
            } else if (lastLog.getSpeed() >= 10) {
                status = "MOVING";
            }

            fleetStatus.add(new FleetStatusDTO(
                    v.getVehicleId(),
                    v.getRegistrationNo(),
                    v.getVehicleType(),
                    v.getDriver() != null ? v.getDriver().getName() : "Unassigned",
                    lastLog.getLatitude(),
                    lastLog.getLongitude(),
                    lastLog.getSpeed(),
                    status,
                    lastLog.getLoggedAt().toString()
            ));
        }
        return fleetStatus;
    }
}
