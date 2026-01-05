//package com.neurofleetx.repository;
//
//import com.neurofleetx.entity.GpsLog;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface GpsRepository extends JpaRepository<GpsLog, Long> {
//
//    List<GpsLog> findByVehicleVehicleIdOrderByTimestampDesc(Long vehicleId);
//
//    // Fetch the very latest log for a specific vehicle
//    @Query(value = "SELECT * FROM gps_logs WHERE vehicle_id = :vehicleId ORDER BY timestamp DESC LIMIT 1", nativeQuery = true)
//    GpsLog findLatestByVehicleId(Long vehicleId);
//}
package com.neurofleetx.repository;

import com.neurofleetx.entity.GpsLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface GpsRepository extends JpaRepository<GpsLog, Long> {

    // Vehicle-based logs (existing feature)
    List<GpsLog> findByVehicle_VehicleIdOrderByLoggedAtDesc(Long vehicleId);

    // Trip-based logs (NEW)
    List<GpsLog> findByTrip_TripIdOrderByLoggedAtAsc(Long tripId);

    // Latest GPS per vehicle (fleet dashboard)
    @Query(
            value = "SELECT * FROM gps_log WHERE vehicle_id = :vehicleId ORDER BY logged_at DESC LIMIT 1",
            nativeQuery = true
    )
    GpsLog findLatestByVehicleId(Long vehicleId);
}
