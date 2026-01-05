// package com.neurofleetx.service;

// import com.neurofleetx.dto.VehicleDTO;
// import com.neurofleetx.entity.Vehicle;
// import com.neurofleetx.repository.VehicleRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import java.util.List;
// import java.util.stream.Collectors;

// @Service
// public class VehicleService {

//     @Autowired
//     private VehicleRepository vehicleRepository;

//     public List<VehicleDTO> getAllVehicles() {
//         return vehicleRepository.findAll().stream()
//                 .map(this::convertToDTO)
//                 .collect(Collectors.toList());
//     }

//     public VehicleDTO getVehicleById(Long id) {
//         return vehicleRepository.findById(id)
//                 .map(this::convertToDTO)
//                 .orElseThrow(() -> new RuntimeException("Vehicle not found"));
//     }

//     public VehicleDTO createVehicle(Vehicle vehicle) {
//         Vehicle saved = vehicleRepository.save(vehicle);
//         return convertToDTO(saved);
//     }

//     public VehicleDTO updateVehicle(Long id, Vehicle vehicle) {
//         Vehicle existing = vehicleRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Vehicle not found"));

//         existing.setRegistrationNo(vehicle.getRegistrationNo());
//         existing.setVehicleType(vehicle.getVehicleType());
//         existing.setFuelType(vehicle.getFuelType());
//         existing.setStatus(vehicle.getStatus());
//         existing.setFuelLevel(vehicle.getFuelLevel());

//         // ✅ FIX: You FORGOT THIS earlier
//         existing.setTotalDistance(vehicle.getTotalDistance());

//         // If driver update exists
//         existing.setDriver(vehicle.getDriver());

//         return convertToDTO(vehicleRepository.save(existing));
//     }

//     public void deleteVehicle(Long id) {
//         vehicleRepository.deleteById(id);
//     }

//     private VehicleDTO convertToDTO(Vehicle vehicle) {
//         return new VehicleDTO(
//                 vehicle.getVehicleId(),
//                 vehicle.getRegistrationNo(),
//                 vehicle.getVehicleType(),
//                 vehicle.getFuelType(),
//                 vehicle.getStatus().name(),
//                 vehicle.getFuelLevel(),
//                 vehicle.getTotalDistance()
//         );
//     }
// }

package com.neurofleetx.service;

import com.neurofleetx.dto.CreateVehicleDTO;
import com.neurofleetx.dto.VehicleDTO;
import com.neurofleetx.entity.Vehicle;
import com.neurofleetx.entity.VehicleStatus;
import com.neurofleetx.repository.VehicleRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private com.neurofleetx.repository.DriverRepository driverRepository;

    // ================= DRIVER MODULE =================

    public VehicleDTO getVehicleByDriverId(Long driverId) {
        return vehicleRepository.findByDriver_DriverId(driverId)
                .map(this::convertToDTO)
                .orElse(null);
    }

    public VehicleDTO getVehicleByUserId(Long userId) {
        return vehicleRepository.findByDriver_User_Id(userId)
                .map(this::convertToDTO)
                .orElse(null);
    }

    public VehicleDTO getVehicleByRegistrationNo(String registrationNo) {
        Vehicle vehicle = vehicleRepository.findByRegistrationNo(registrationNo)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        return convertToDTO(vehicle);
    }

    // ================= ADMIN / MANAGER =================

    public List<VehicleDTO> getAllVehicles() {
        return vehicleRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public VehicleDTO getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        return convertToDTO(vehicle);
    }

    public VehicleDTO createVehicle(CreateVehicleDTO dto) {
        Vehicle vehicle = new Vehicle();
        vehicle.setRegistrationNo(dto.getRegistrationNo());
        vehicle.setVehicleType(dto.getVehicleType());
        vehicle.setFuelType(dto.getFuelType());
        vehicle.setFuelLevel(dto.getFuelLevel());
        vehicle.setStatus(VehicleStatus.ACTIVE);

        if (dto.getDriverId() != null) {
            com.neurofleetx.entity.Driver driver = driverRepository.findById(dto.getDriverId())
                    .orElseThrow(() -> new RuntimeException("Driver not found"));
            vehicle.setDriver(driver);
        }

        return convertToDTO(vehicleRepository.save(vehicle));
    }

    @Transactional
    public VehicleDTO updateVehicle(Long id, com.neurofleetx.dto.UpdateVehicleDTO vehicleDTO) {
        Vehicle existing = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        if (vehicleDTO.getRegistrationNo() != null)
            existing.setRegistrationNo(vehicleDTO.getRegistrationNo());

        if (vehicleDTO.getVehicleType() != null)
            existing.setVehicleType(vehicleDTO.getVehicleType());

        if (vehicleDTO.getFuelType() != null)
            existing.setFuelType(vehicleDTO.getFuelType());

        if (vehicleDTO.getStatus() != null)
            existing.setStatus(VehicleStatus.valueOf(vehicleDTO.getStatus()));

        if (vehicleDTO.getFuelLevel() != null)
            existing.setFuelLevel(vehicleDTO.getFuelLevel());

        if (vehicleDTO.getTotalDistance() != null)
            existing.setTotalDistance(vehicleDTO.getTotalDistance());

        if (vehicleDTO.getDriverId() != null) {
            com.neurofleetx.entity.Driver driver = driverRepository.findById(vehicleDTO.getDriverId())
                    .orElseThrow(() -> new RuntimeException("Driver not found"));
            existing.setDriver(driver);
        }

        return convertToDTO(vehicleRepository.save(existing));
    }

    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }

    // ================= DTO =================

    private VehicleDTO convertToDTO(Vehicle vehicle) {
        return new VehicleDTO(
                vehicle.getVehicleId(),
                vehicle.getRegistrationNo(),
                vehicle.getVehicleType(),
                vehicle.getFuelType(),
                vehicle.getStatus() != null ? vehicle.getStatus().name() : null,
                vehicle.getFuelLevel(),
                vehicle.getTotalDistance(),
                vehicle.getDriver() != null ? vehicle.getDriver().getDriverId() : null,
                vehicle.getDriver() != null ? vehicle.getDriver().getName() : null);
    }
}
