package com.neurofleetx.service;

import com.neurofleetx.dto.DriverDTO;
import com.neurofleetx.entity.Driver;
import com.neurofleetx.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;

    public List<DriverDTO> getAllDrivers() {
        return driverRepository.findAll().stream()
                .filter(d -> d.getArchived() == null || !d.getArchived())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DriverDTO getDriverById(Long id) {
        return driverRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
    }

    public DriverDTO createDriver(Driver driver) {
        return convertToDTO(driverRepository.save(driver));
    }

    public DriverDTO updateDriver(Long id, Driver updated) {
        Driver d = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        d.setName(updated.getName());
        d.setEmail(updated.getEmail());
        d.setPhone(updated.getPhone());
        d.setLicenseNo(updated.getLicenseNo());
        d.setExperienceYears(updated.getExperienceYears());

        if (updated.getArchived() != null)
            d.setArchived(updated.getArchived());

        return convertToDTO(driverRepository.save(d));
    }

    public DriverDTO getDriverByUserId(Long userId) {
        return driverRepository.findByUser_Id(userId)
                .map(this::convertToDTO)
                .orElse(null);
    }

    private DriverDTO convertToDTO(Driver d) {
        return new DriverDTO(
                d.getDriverId(),
                d.getName(),
                d.getLicenseNo(),
                d.getPhone(),
                d.getEmail(),
                d.getRating(),
                d.getTotalTrips(),
                d.getExperienceYears(),
                d.getArchived());
    }
}
