package com.neurofleetx.controller;

import com.neurofleetx.dto.VehicleDTO;

import com.neurofleetx.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin("*")
public class VehicleController {
    @Autowired
    private VehicleService vehicleService;

    @GetMapping
    public ResponseEntity<List<VehicleDTO>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleDTO> getVehicle(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.getVehicleById(id));
    }
    // @GetMapping("/{email}")
    // public ResponseEntity<VehicleDTO> getVehicleById(@PathVariable String email)
    // {
    // return ResponseEntity.ok(vehicleService.getVehicleByEmail(email)); //
    // Assuming this method exists or will exist check
    // }

    @PostMapping
    public ResponseEntity<VehicleDTO> createVehicle(@RequestBody com.neurofleetx.dto.CreateVehicleDTO vehicleDTO) {
        return ResponseEntity.ok(vehicleService.createVehicle(vehicleDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleDTO> updateVehicle(@PathVariable Long id,
            @RequestBody com.neurofleetx.dto.UpdateVehicleDTO vehicleDTO) {
        return ResponseEntity.ok(vehicleService.updateVehicle(id, vehicleDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<VehicleDTO> getVehicleByDriverId(@PathVariable Long driverId) {
        return ResponseEntity.ok(vehicleService.getVehicleByDriverId(driverId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<VehicleDTO> getVehicleByUserId(@PathVariable Long userId) {
        System.out.println("DEBUG: Request received for getVehicleByUserId with ID: " + userId);
        VehicleDTO dto = vehicleService.getVehicleByUserId(userId);
        System.out.println("DEBUG: Service returned: " + dto);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/registration/{registrationNo}")
    public ResponseEntity<VehicleDTO> getVehicleByRegistration(
            @PathVariable String registrationNo) {
        return ResponseEntity.ok(
                vehicleService.getVehicleByRegistrationNo(registrationNo));
    }
}
