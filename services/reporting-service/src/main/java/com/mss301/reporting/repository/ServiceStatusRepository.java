package com.mss301.reporting.repository;

import com.mss301.reporting.entity.ServiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ServiceStatusRepository extends JpaRepository<ServiceStatus, UUID> {

    List<ServiceStatus> findAllByOrderByPortAsc();
}
