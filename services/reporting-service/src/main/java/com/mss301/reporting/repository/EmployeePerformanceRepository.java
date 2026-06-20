package com.mss301.reporting.repository;

import com.mss301.reporting.entity.EmployeePerformance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EmployeePerformanceRepository extends JpaRepository<EmployeePerformance, UUID> {
}
