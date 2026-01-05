package com.neurofleetx.service;

import com.neurofleetx.entity.MaintenanceLog;
import com.neurofleetx.entity.Vehicle;
import com.neurofleetx.repository.MaintenanceRepository;
import com.neurofleetx.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class MaintenanceService {

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    public List<MaintenanceLog> getMaintenanceHistory(Long vehicleId) {
        return maintenanceRepository.findByVehicleVehicleIdOrderByMaintenanceDateDesc(vehicleId);
    }

    public MaintenanceLog createMaintenanceLog(Long vehicleId, MaintenanceLog log) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        log.setVehicle(vehicle);

        // Use IST LocalDateTime
        log.setCreatedAt(LocalDateTime.now(ZoneId.of("Asia/Kolkata")));

        // If maintenanceDate not provided, default to now()
        if (log.getMaintenanceDate() == null) {
            log.setMaintenanceDate(LocalDateTime.now(ZoneId.of("Asia/Kolkata")));
        }

        return maintenanceRepository.save(log);
    }

    public void deleteMaintenanceLog(Long id) {
        maintenanceRepository.deleteById(id);
    }
}
