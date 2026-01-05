package com.neurofleetx.controller;

import com.neurofleetx.entity.MaintenanceLog;
import com.neurofleetx.service.MaintenanceService;
import com.neurofleetx.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin("*")
public class MaintenanceController {

    @Autowired
    private MaintenanceService maintenanceService;

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<?> getMaintenanceHistory(@PathVariable Long vehicleId) {
        try {
            List<MaintenanceLog> logs = maintenanceService.getMaintenanceHistory(vehicleId);
            return ResponseUtil.success("Maintenance history retrieved", logs);
        } catch (Exception e) {
            return ResponseUtil.serverError(e.getMessage());
        }
    }

    @PostMapping("/vehicle/{vehicleId}")
    public ResponseEntity<?> createMaintenanceLog(
            @PathVariable Long vehicleId,
            @RequestBody MaintenanceLog log) {
        try {
            MaintenanceLog created = maintenanceService.createMaintenanceLog(vehicleId, log);
            return ResponseUtil.created("Maintenance log created", created);
        } catch (Exception e) {
            return ResponseUtil.badRequest(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMaintenanceLog(@PathVariable Long id) {
        try {
            maintenanceService.deleteMaintenanceLog(id);
            return ResponseUtil.success("Maintenance log deleted", null);
        } catch (Exception e) {
            return ResponseUtil.serverError(e.getMessage());
        }
    }
}