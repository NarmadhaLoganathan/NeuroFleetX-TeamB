package com.neurofleetx.repository;

import com.neurofleetx.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByStatus(String status);

    Optional<Vehicle> findByDriverEmail(String email);

    Optional<Vehicle> findByRegistrationNo(String registrationNo);

    Optional<Vehicle> findByDriver_DriverId(Long driverId);

    Optional<Vehicle> findByDriver_User_Id(Long userId);

}
