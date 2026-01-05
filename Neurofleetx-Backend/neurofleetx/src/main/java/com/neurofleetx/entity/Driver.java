package com.neurofleetx.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.ZoneId;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "driver")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long driverId;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String name;

    @Column(name = "license_no")
    private String licenseNo;

    @Column(name = "phone")
    private String phone;

    private String email;

    private Double rating = 0.0;
    private Integer totalTrips = 0;

    @Column(name = "experience_years")
    private Integer experienceYears;

    private Boolean archived = false;

    private LocalDateTime createdAt;
    @OneToOne(mappedBy = "driver")
    @JsonIgnore
    private Vehicle vehicle;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
    }

}
