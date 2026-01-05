package com.neurofleetx.service;

import com.neurofleetx.entity.Alert;
import com.neurofleetx.repository.AlertRepository;
import com.neurofleetx.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AlertService {
    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private DriverRepository driverRepository;

    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }

    public List<Alert> getUnresolvedAlerts() {
        return alertRepository.findByIsResolvedFalse();
    }

    public List<Alert> getUnresolvedAlertsByUserId(Long userId) {
        System.out.println("DEBUG: Finding driver for userId: " + userId);
        com.neurofleetx.entity.Driver driver = driverRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Driver not found for user ID: " + userId));

        System.out.println("DEBUG: Found driver: " + driver.getDriverId() + ", Name: " + driver.getName());
        List<Alert> alerts = alertRepository.findByVehicleDriverAndIsResolvedFalse(driver);
        System.out.println("DEBUG: Found " + alerts.size() + " alerts for driver " + driver.getDriverId());
        return alerts;
    }

    public Alert createAlert(Alert alert) {
        return alertRepository.save(alert);
    }

    public Alert resolveAlert(Long id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found"));
        alert.setIsResolved(true);
        return alertRepository.save(alert);
    }
}
