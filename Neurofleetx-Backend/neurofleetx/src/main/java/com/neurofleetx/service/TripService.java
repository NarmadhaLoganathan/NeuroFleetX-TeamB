// package com.neurofleetx.service;

// import com.neurofleetx.dto.TripCreateDTO;
// import com.neurofleetx.entity.Driver;
// import com.neurofleetx.entity.Trip;
// import com.neurofleetx.entity.TripStatus;
// import com.neurofleetx.entity.Vehicle;
// import com.neurofleetx.repository.DriverRepository;
// import com.neurofleetx.repository.TripRepository;
// import com.neurofleetx.repository.VehicleRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import java.util.List;

// @Service
// public class TripService {

//     @Autowired
//     private TripRepository tripRepository;

//     @Autowired
//     private VehicleRepository vehicleRepository;

//     @Autowired
//     private DriverRepository driverRepository;

//     public List<Trip> getAllTrips() {
//         return tripRepository.findAll();
//     }

//     public Trip getTripById(Long id) {
//         return tripRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Trip not found"));
//     }

//     public Trip createTrip(TripCreateDTO dto) {

//         Vehicle vehicle = vehicleRepository.findById(dto.getVehicleId())
//                 .orElseThrow(() -> new RuntimeException("Vehicle not found"));

//         Driver driver = driverRepository.findById(dto.getDriverId())
//                 .orElseThrow(() -> new RuntimeException("Driver not found"));

//         Trip trip = new Trip();
//         trip.setVehicle(vehicle);
//         trip.setDriver(driver);
//         trip.setStartLocation(dto.getStartLocation());
//         trip.setEndLocation(dto.getEndLocation());
//         trip.setDistance(dto.getDistance());

//         trip.setStartTime(dto.getStartTime());
//         trip.setEndTime(dto.getEndTime());
//         trip.setEta(dto.getEta());

//         trip.setStatus(TripStatus.valueOf(dto.getStatus()));

//         return tripRepository.save(trip);
//     }

//     // --- NEW: Full Update Method ---
//     public Trip updateTrip(Long id, TripCreateDTO dto) {

//         Trip trip = tripRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Trip not found"));

//         Vehicle vehicle = vehicleRepository.findById(dto.getVehicleId())
//                 .orElseThrow(() -> new RuntimeException("Vehicle not found"));

//         Driver driver = driverRepository.findById(dto.getDriverId())
//                 .orElseThrow(() -> new RuntimeException("Driver not found"));

//         trip.setVehicle(vehicle);
//         trip.setDriver(driver);
//         trip.setStartLocation(dto.getStartLocation());
//         trip.setEndLocation(dto.getEndLocation());
//         trip.setDistance(dto.getDistance());

//         trip.setStartTime(dto.getStartTime());
//         trip.setEndTime(dto.getEndTime());
//         trip.setEta(dto.getEta());

//         trip.setStatus(TripStatus.valueOf(dto.getStatus()));

//         return tripRepository.save(trip);
//     }

//     public Trip updateTripStatus(Long id, String status) {
//         Trip trip = tripRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Trip not found"));

//         trip.setStatus(TripStatus.valueOf(status));
//         return tripRepository.save(trip);
//     }

//     // --- NEW: Delete Method ---
//     public void deleteTrip(Long id) {
//         if (!tripRepository.existsById(id)) {
//             throw new RuntimeException("Trip not found");
//         }
//         tripRepository.deleteById(id);
//     }
// }
package com.neurofleetx.service;

import com.neurofleetx.dto.TripCreateDTO;
import com.neurofleetx.entity.Driver;
import com.neurofleetx.entity.Trip;
import com.neurofleetx.entity.TripStatus;
import com.neurofleetx.entity.Vehicle;
import com.neurofleetx.repository.DriverRepository;
import com.neurofleetx.repository.TripRepository;
import com.neurofleetx.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TripService {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DriverRepository driverRepository;

    // ======================================================
    // 1️⃣ CREATE TRIP
    // ======================================================
    public Trip createTrip(TripCreateDTO dto) {

        Vehicle vehicle = vehicleRepository.findById(dto.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        Driver driver = driverRepository.findById(dto.getDriverId())
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        System.out.println("DEBUG: Creating Trip. Stored Dist: " + dto.getDistance());

        Trip trip = new Trip();
        trip.setVehicle(vehicle);
        trip.setDriver(driver);
        trip.setStartLocation(dto.getStartLocation());
        trip.setEndLocation(dto.getEndLocation());
        trip.setDistance(dto.getDistance());

        // ETA = distance / avgSpeed * 60
        long etaMinutes = Math.round((dto.getDistance() / 40.0) * 60);
        trip.setEta(LocalDateTime.now().plusMinutes(etaMinutes));

        trip.setStatus(TripStatus.valueOf(dto.getStatus()));
        trip.setCreatedAt(LocalDateTime.now());

        // Fix: Ensure StartTime is set if ONGOING
        if (trip.getStatus() == TripStatus.ONGOING && trip.getStartTime() == null) {
            trip.setStartTime(LocalDateTime.now());
        } else if (dto.getStartTime() != null) {
            trip.setStartTime(dto.getStartTime());
        }

        return tripRepository.save(trip);
    }

    // ======================================================
    // 2️⃣ END TRIP (IMPORTANT)
    // ======================================================
    public Trip endTrip(Long tripId, Double distance) {

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        trip.setStatus(TripStatus.COMPLETED);
        trip.setEndTime(LocalDateTime.now());

        // Update distance if provided (and greater than existing)
        if (distance != null && distance > 0) {
            trip.setDistance(distance);
        }

        return tripRepository.save(trip);
    }

    // ======================================================
    // 3️⃣ UPDATE TRIP (ADMIN / MANAGER)
    // ======================================================
    public Trip updateTrip(Long id, TripCreateDTO dto) {

        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        trip.setStatus(TripStatus.valueOf(dto.getStatus()));
        return tripRepository.save(trip);
    }

    // ======================================================
    // 4️⃣ UPDATE STATUS ONLY
    // ======================================================
    public Trip updateTripStatus(Long id, String status) {

        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        trip.setStatus(TripStatus.valueOf(status));
        return tripRepository.save(trip);
    }

    // ======================================================
    // 5️⃣ GETTERS
    // ======================================================
    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    public Trip getTripById(Long id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
    }

    public List<Trip> getTripsByDriver(Long driverId) {
        return tripRepository.findByDriver_DriverId(driverId);
    }

    // ======================================================
    // 6️⃣ DELETE TRIP
    // ======================================================
    public void deleteTrip(Long id) {
        if (!tripRepository.existsById(id)) {
            throw new RuntimeException("Trip not found");
        }
        tripRepository.deleteById(id);
    }

    // ======================================================
    // 7️⃣ GET ACTIVE TRIP
    // ======================================================
    public Trip getActiveTrip(Long userId) {
        List<Trip> trips = tripRepository.findByDriver_User_IdAndStatus(userId, TripStatus.ONGOING);
        if (trips.isEmpty()) {
            return null;
        }
        // Return the last one (assuming higher ID = newer, or just picking one to avoid
        // crash)
        return trips.get(trips.size() - 1);
    }
}
