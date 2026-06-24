package com.mss301.reporting.repository;

import com.mss301.reporting.entity.MonthlyRevenue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MonthlyRevenueRepository extends JpaRepository<MonthlyRevenue, UUID> {

    List<MonthlyRevenue> findAllByOrderBySeqAsc();
}
