package com.neurofleetx.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GpsDTO {
    private Long gpsId;
    private Long vehicleId;
    private String vehicleRegistration;
    private Double latitude;
    private Double speed;
    private Long timestamp;
    private Double longitude;

    // Additional fields for tracking
    private String direction;
    private Double accuracy;
}

// ===== FILE: TripDTO.java =====
