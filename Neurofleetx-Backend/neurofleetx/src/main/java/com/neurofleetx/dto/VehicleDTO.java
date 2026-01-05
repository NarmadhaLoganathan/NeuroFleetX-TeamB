package com.neurofleetx.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDTO {
    private Long vehicleId;
    private String registrationNo;
    private String vehicleType;
    private String fuelType;
    private String status;
    private Double fuelLevel;
    private Integer totalDistance;
    private Long driverId;
    private String driverName;
}
