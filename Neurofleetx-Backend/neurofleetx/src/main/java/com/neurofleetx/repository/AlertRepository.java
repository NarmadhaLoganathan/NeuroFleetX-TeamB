package com.neurofleetx.repository;

import com.neurofleetx.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByIsResolvedFalse();

    List<Alert> findByVehicleVehicleId(Long vehicleId);

    List<Alert> findByVehicleDriverAndIsResolvedFalse(com.neurofleetx.entity.Driver driver);
}
