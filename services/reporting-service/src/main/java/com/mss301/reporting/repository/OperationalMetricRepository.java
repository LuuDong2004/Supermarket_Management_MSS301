package com.mss301.reporting.repository;

import com.mss301.reporting.entity.OperationalMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OperationalMetricRepository extends JpaRepository<OperationalMetric, UUID> {

    List<OperationalMetric> findAllByOrderBySeqAsc();
}
