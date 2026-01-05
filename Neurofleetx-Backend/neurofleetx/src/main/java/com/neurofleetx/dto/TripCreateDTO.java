package com.neurofleetx.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TripCreateDTO {
    private Long vehicleId;
    private Long driverId;

    private String startLocation;
    private String endLocation;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime eta;

    private Double distance;
    private String status;
}
