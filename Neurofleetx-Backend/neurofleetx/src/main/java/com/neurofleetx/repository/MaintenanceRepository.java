package com.neurofleetx.repository;

import com.neurofleetx.entity.MaintenanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MaintenanceRepository extends JpaRepository<MaintenanceLog, Long> {
    List<MaintenanceLog> findByVehicleVehicleIdOrderByMaintenanceDateDesc(Long vehicleId);

    @Query("SELECT m FROM MaintenanceLog m WHERE m.vehicle.vehicleId = :vehicleId ORDER BY m.maintenanceDate DESC")
    List<MaintenanceLog> getMaintenanceHistory(@Param("vehicleId") Long vehicleId);
}