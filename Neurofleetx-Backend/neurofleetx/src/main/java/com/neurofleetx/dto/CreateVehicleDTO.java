package com.neurofleetx.dto;

import lombok.Data;

@Data
public class CreateVehicleDTO {
    private String registrationNo;
    private String vehicleType;
    private String fuelType;
    private Double fuelLevel;
    private Long driverId;
}
