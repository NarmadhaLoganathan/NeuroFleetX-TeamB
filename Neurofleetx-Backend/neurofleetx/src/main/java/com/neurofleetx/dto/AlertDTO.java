package com.neurofleetx.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlertDTO {
    private Long alertId;
    private Long vehicleId;
    private String vehicleRegistration;
    private String alertType;
    private String severity;
    private String description;
    private Boolean isResolved;
    private Long createdAt;
}
