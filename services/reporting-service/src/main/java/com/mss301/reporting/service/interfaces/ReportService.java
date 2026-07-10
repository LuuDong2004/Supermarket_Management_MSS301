package com.mss301.reporting.service.interfaces;

import com.mss301.reporting.dto.response.CategoryShareResponse;
import com.mss301.reporting.dto.response.DashboardResponse;
import com.mss301.reporting.dto.response.EmployeePerformanceResponse;
import com.mss301.reporting.dto.response.FinancialReportResponse;
import com.mss301.reporting.dto.response.MonthlyRevenueResponse;
import com.mss301.reporting.dto.response.OperationalMetricResponse;
import com.mss301.reporting.dto.response.SalesTrendResponse;

import java.util.List;

public interface ReportService {

    List<SalesTrendResponse> salesTrend();

    List<CategoryShareResponse> categoryShare();

    List<EmployeePerformanceResponse> employeePerformance();

    List<MonthlyRevenueResponse> monthlyRevenue();

    List<FinancialReportResponse> financialReport();

    List<OperationalMetricResponse> operationalMetrics();

    DashboardResponse dashboard();
}
