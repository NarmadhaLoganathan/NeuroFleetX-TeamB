package com.neurofleetx.controller;

import com.neurofleetx.entity.Alert;
import com.neurofleetx.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin("*")
public class AlertController {

    @Autowired
    private AlertService alertService;

    @GetMapping
    public ResponseEntity<List<Alert>> getAllAlerts() {
        return ResponseEntity.ok(alertService.getAllAlerts());
    }

    @GetMapping("/unresolved")
    public ResponseEntity<List<Alert>> getUnresolvedAlerts() {
        return ResponseEntity.ok(alertService.getUnresolvedAlerts());
    }

    @GetMapping("/unresolved/user/{userId}")
    public ResponseEntity<List<Alert>> getUnresolvedAlertsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(alertService.getUnresolvedAlertsByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<Alert> createAlert(@RequestBody Alert alert) {
        return ResponseEntity.ok(alertService.createAlert(alert));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<Alert> resolveAlert(@PathVariable Long id) {
        return ResponseEntity.ok(alertService.resolveAlert(id));
    }
}
