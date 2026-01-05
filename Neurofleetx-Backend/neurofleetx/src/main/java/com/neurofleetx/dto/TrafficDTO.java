package com.neurofleetx.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrafficDTO {
    private Long trafficId;
    private String location;
    private Double latitude;
    private Double longitude;
    private Integer vehicleDensity;
    private Double avgSpeed;
    private String congestionLevel;
    private Long timestamp;
}
