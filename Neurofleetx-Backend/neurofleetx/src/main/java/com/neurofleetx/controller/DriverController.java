package com.neurofleetx.controller;

import com.neurofleetx.dto.DriverCreateRequest;
import com.neurofleetx.dto.DriverDTO;
import com.neurofleetx.entity.Driver;
import com.neurofleetx.entity.User;
import com.neurofleetx.repository.DriverRepository;
import com.neurofleetx.repository.UserRepository;
import com.neurofleetx.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin("*")
public class DriverController {

    @Autowired
    private DriverService driverService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<List<DriverDTO>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DriverDTO> getDriver(@PathVariable Long id) {
        return ResponseEntity.ok(driverService.getDriverById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<DriverDTO> getDriverByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(driverService.getDriverByUserId(userId));
    }

    // CREATE simple driver (old)
    @PostMapping
    public ResponseEntity<DriverDTO> createDriver(@RequestBody Driver driver) {
        return ResponseEntity.ok(driverService.createDriver(driver));
    }

    // UPDATE driver
    @PutMapping("/{id}")
    public ResponseEntity<DriverDTO> updateDriver(@PathVariable Long id, @RequestBody Driver driver) {
        return ResponseEntity.ok(driverService.updateDriver(id, driver));
    }

    // CREATE FULL DRIVER (User + Driver)
    @PostMapping("/create-full")
    public ResponseEntity<?> createFullDriver(@RequestBody DriverCreateRequest req) {

        // 1. Create USER
        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole("DRIVER");
        userRepository.save(user);

        // 2. Create DRIVER Profile
        Driver driver = new Driver();
        driver.setUser(user);
        driver.setName(req.getName());
        driver.setEmail(req.getEmail());
        driver.setLicenseNo(req.getLicenseNo());
        driver.setPhone(req.getPhone());
        driver.setExperienceYears(req.getExperienceYears());

        driverRepository.save(driver);

        return ResponseEntity.ok("Driver + account created successfully!");
    }
}
