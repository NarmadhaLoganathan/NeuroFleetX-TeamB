package com.neurofleetx.repository;

import com.neurofleetx.entity.TrafficData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TrafficRepository extends JpaRepository<TrafficData, Long> {

    List<TrafficData> findByLocationOrderByTimestampDesc(String location);

    // Correct type: LocalDateTime, not Long
    List<TrafficData> findByTimestampGreaterThanOrderByTimestampDesc(LocalDateTime timestamp);
}
