package com.neurofleetx.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Entity
@Table(
        name = "traffic_data",
        indexes = {
                @Index(name = "idx_location", columnList = "location"),
                @Index(name = "idx_timestamp", columnList = "timestamp")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrafficData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long trafficId;

    private String location;
    private Double latitude;
    private Double longitude;

    private Integer vehicleDensity;
    private Double avgSpeed;

    @Enumerated(EnumType.STRING)
    private CongestionLevel congestionLevel = CongestionLevel.LOW;

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
    }
}
