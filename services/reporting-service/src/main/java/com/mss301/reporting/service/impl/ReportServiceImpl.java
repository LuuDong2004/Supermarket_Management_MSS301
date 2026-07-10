package com.mss301.reporting.service.impl;

import com.mss301.reporting.dto.response.CategoryShareResponse;
import com.mss301.reporting.dto.response.DashboardResponse;
import com.mss301.reporting.dto.response.EmployeePerformanceResponse;
import com.mss301.reporting.dto.response.FinancialReportResponse;
import com.mss301.reporting.dto.response.MonthlyRevenueResponse;
import com.mss301.reporting.dto.response.OperationalMetricResponse;
import com.mss301.reporting.dto.response.SalesTrendResponse;
import com.mss301.reporting.entity.SalesTrendPoint;
import com.mss301.reporting.mapper.ReportingMapper;
import com.mss301.reporting.repository.CategoryShareRepository;
import com.mss301.reporting.repository.EmployeePerformanceRepository;
import com.mss301.reporting.repository.FinancialReportRepository;
import com.mss301.reporting.repository.MonthlyRevenueRepository;
import com.mss301.reporting.repository.OperationalMetricRepository;
import com.mss301.reporting.repository.SalesTrendPointRepository;
import com.mss301.reporting.service.interfaces.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {

    private static final BigDecimal REVENUE_SCALE = BigDecimal.valueOf(1_000_000L);

    private final SalesTrendPointRepository salesTrendPointRepository;
    private final CategoryShareRepository categoryShareRepository;
    private final EmployeePerformanceRepository employeePerformanceRepository;
    private final MonthlyRevenueRepository monthlyRevenueRepository;
    private final FinancialReportRepository financialReportRepository;
    private final OperationalMetricRepository operationalMetricRepository;
    private final ReportingMapper reportingMapper;

    @Override
    public List<SalesTrendResponse> salesTrend() {
        return salesTrendPointRepository.findAllByOrderBySeqAsc().stream()
                .map(reportingMapper::toResponse)
                .toList();
    }

    @Override
    public List<CategoryShareResponse> categoryShare() {
        return categoryShareRepository.findAll().stream()
                .map(reportingMapper::toResponse)
                .toList();
    }

    @Override
    public List<EmployeePerformanceResponse> employeePerformance() {
        return employeePerformanceRepository.findAll().stream()
                .map(reportingMapper::toResponse)
                .toList();
    }

    @Override
    public List<MonthlyRevenueResponse> monthlyRevenue() {
        return monthlyRevenueRepository.findAllByOrderBySeqAsc().stream()
                .map(reportingMapper::toResponse)
                .toList();
    }

    @Override
    public List<FinancialReportResponse> financialReport() {
        return financialReportRepository.findAllByOrderBySeqAsc().stream()
                .map(reportingMapper::toResponse)
                .toList();
    }

    @Override
    public List<OperationalMetricResponse> operationalMetrics() {
        return operationalMetricRepository.findAllByOrderBySeqAsc().stream()
                .map(reportingMapper::toResponse)
                .toList();
    }

    @Override
    public DashboardResponse dashboard() {
        List<SalesTrendPoint> trend = salesTrendPointRepository.findAllByOrderBySeqAsc();
        BigDecimal todayRevenue = BigDecimal.ZERO;
        long todayOrders = 0L;
        if (!trend.isEmpty()) {
            SalesTrendPoint last = trend.get(trend.size() - 1);
            todayRevenue = REVENUE_SCALE.multiply(BigDecimal.valueOf(last.getRevenue()));
            todayOrders = last.getOrders();
        }
        return new DashboardResponse(todayRevenue, todayOrders, 3L, 1L);
    }
}
