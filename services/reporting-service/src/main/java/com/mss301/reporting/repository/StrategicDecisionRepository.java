package com.mss301.reporting.repository;

import com.mss301.reporting.entity.StrategicDecision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StrategicDecisionRepository extends JpaRepository<StrategicDecision, UUID> {

    List<StrategicDecision> findAllByOrderByDecisionDateDesc();

    boolean existsByCode(String code);
}
