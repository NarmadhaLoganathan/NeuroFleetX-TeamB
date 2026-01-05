package com.neurofleetx.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TripDTO {
    private Long tripId;
    private Long vehicleId;
    private String vehicleRegistration;
    private Long driverId;
    private String driverName;
    private String startLocation;
    private String endLocation;
    private Long startTime;
    private Long endTime;
    private Long eta;
    private Double distance;
    private Double fuelConsumed;
    private String status;
    private Long createdAt;

    // Calculated fields
    private Long duration; // in minutes
    private Double avgSpeed;
    private Double fuelEfficiency; // km per liter
}
