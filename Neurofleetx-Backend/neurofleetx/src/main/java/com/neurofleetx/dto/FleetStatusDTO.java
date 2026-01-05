package com.neurofleetx.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FleetStatusDTO {
    private Long vehicleId;
    private String registrationNo;
    private String type;
    private String driverName;
    private Double latitude;
    private Double longitude;
    private Double speed;
    private String status; // MOVING, IDLING, STOPPED
    private String lastUpdate;
}