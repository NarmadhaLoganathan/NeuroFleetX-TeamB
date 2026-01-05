package com.neurofleetx.dto;

import lombok.Data;

@Data
public class TrafficCreateRequest {
    private String location;
    private Integer vehicleDensity;
    private Double avgSpeed;
}
