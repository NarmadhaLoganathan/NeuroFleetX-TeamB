package com.neurofleetx.repository;

import com.neurofleetx.entity.GpsLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GpsLogRepository extends JpaRepository<GpsLog, Long> {
    // Example finder: get last N logs for a junction (you must store junction id in
    // logs)

}
