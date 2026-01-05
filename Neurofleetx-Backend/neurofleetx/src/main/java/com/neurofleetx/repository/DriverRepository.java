package com.neurofleetx.repository;
import com.neurofleetx.entity.Driver;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DriverRepository extends JpaRepository<Driver, Long> {

        Optional<Driver> findByUser_Id(Long userId);
Optional<Driver> findByUser_Email(String email);

}
