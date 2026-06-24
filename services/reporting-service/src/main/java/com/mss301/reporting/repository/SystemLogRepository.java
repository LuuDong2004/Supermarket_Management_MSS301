package com.mss301.reporting.repository;

import com.mss301.reporting.entity.SystemLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SystemLogRepository extends JpaRepository<SystemLog, UUID> {

    List<SystemLog> findAllByOrderByCodeDesc();
}
