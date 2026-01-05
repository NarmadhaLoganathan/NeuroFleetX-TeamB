package com.neurofleetx.repository;

import com.neurofleetx.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByStatus(String status);

    List<Trip> findByDriver_DriverId(Long driverId); // frontend NEEDS this

    // Find active trip
    List<Trip> findByDriver_User_IdAndStatus(Long userId, com.neurofleetx.entity.TripStatus status);
}
