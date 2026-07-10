package com.mss301.reporting.repository;

import com.mss301.reporting.entity.FinancialReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FinancialReportRepository extends JpaRepository<FinancialReport, UUID> {

    List<FinancialReport> findAllByOrderBySeqAsc();
}
