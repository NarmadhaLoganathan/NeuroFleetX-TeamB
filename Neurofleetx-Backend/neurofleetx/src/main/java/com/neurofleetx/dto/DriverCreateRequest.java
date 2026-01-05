package com.neurofleetx.dto;

import lombok.Data;

@Data
public class DriverCreateRequest {
    private String name;
    private String email;
    private String password;
    private String licenseNo;
    private String phone;
    private Integer experienceYears;

}
