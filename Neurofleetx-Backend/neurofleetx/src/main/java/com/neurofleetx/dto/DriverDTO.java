package com.neurofleetx.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DriverDTO {
    private Long driverId;
    private String name;
    private String licenseNo;
    private String phone;
    private String email;
    private Double rating;
    private Integer totalTrips;
    private Integer experienceYears;
    private Boolean archived;
}
