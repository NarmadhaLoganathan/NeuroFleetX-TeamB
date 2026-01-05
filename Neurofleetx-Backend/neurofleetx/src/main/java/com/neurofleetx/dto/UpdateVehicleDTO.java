package com.neurofleetx.dto;

import lombok.Data;

@Data
public class UpdateVehicleDTO {
    private String registrationNo;
    private String vehicleType;
    private String fuelType;
    private String status;
    private Double fuelLevel;
    private Integer totalDistance;
    private Long driverId; // For updating assigned driver
}
