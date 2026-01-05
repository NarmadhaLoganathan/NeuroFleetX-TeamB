package com.neurofleetx.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceDTO {
    private Long maintenanceId;
    private Long vehicleId;
    private String vehicleRegistration;
    private String maintenanceType;
    private Double cost;
    private String description;
    private Long maintenanceDate;
    private Long createdAt;
}