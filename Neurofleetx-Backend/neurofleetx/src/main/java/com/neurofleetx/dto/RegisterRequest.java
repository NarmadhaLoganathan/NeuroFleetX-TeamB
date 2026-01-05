package com.neurofleetx.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role;

    private String licenseNumber;     // NEW
    private String phoneNumber;       // NEW
    private Integer experienceYears;  // NEW
}
