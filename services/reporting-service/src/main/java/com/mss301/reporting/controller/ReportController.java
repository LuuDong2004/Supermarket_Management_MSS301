package com.mss301.reporting.controller;

import com.mss301.reporting.dto.response.CategoryShareResponse;
import com.mss301.reporting.dto.response.DashboardResponse;
import com.mss301.reporting.dto.response.EmployeePerformanceResponse;
import com.mss301.reporting.dto.response.FinancialReportResponse;
import com.mss301.reporting.dto.response.MonthlyRevenueResponse;
import com.mss301.reporting.dto.response.OperationalMetricResponse;
import com.mss301.reporting.dto.response.SalesTrendResponse;
import com.mss301.reporting.service.interfaces.ReportService;
import com.mss301.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Reports", description = "Reporting and analytics endpoints")
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('CEO','ADMIN')")
public class ReportController {

    private final ReportService reportService;

    @Operation(summary = "Weekly sales trend")
    @GetMapping("/sales-trend")
    public ApiResponse<List<SalesTrendResponse>> salesTrend() {
        return ApiResponse.success(reportService.salesTrend());
    }

    @Operation(summary = "Revenue share by category")
    @GetMapping("/category-share")
    public ApiResponse<List<CategoryShareResponse>> categoryShare() {
        return ApiResponse.success(reportService.categoryShare());
    }

    @Operation(summary = "Employee performance metrics")
    @GetMapping("/employee-performance")
    public ApiResponse<List<EmployeePerformanceResponse>> employeePerformance() {
        return ApiResponse.success(reportService.employeePerformance());
    }

    @Operation(summary = "Monthly revenue vs target")
    @GetMapping("/monthly-revenue")
    public ApiResponse<List<MonthlyRevenueResponse>> monthlyRevenue() {
        return ApiResponse.success(reportService.monthlyRevenue());
    }

    @Operation(summary = "Monthly financial report (revenue, cost, profit)")
    @GetMapping("/financial")
    public ApiResponse<List<FinancialReportResponse>> financial() {
        return ApiResponse.success(reportService.financialReport());
    }

    @Operation(summary = "Operational performance by business area")
    @GetMapping("/operational")
    public ApiResponse<List<OperationalMetricResponse>> operational() {
        return ApiResponse.success(reportService.operationalMetrics());
    }

    @Operation(summary = "Dashboard summary")
    @GetMapping("/dashboard")
    public ApiResponse<DashboardResponse> dashboard() {
        return ApiResponse.success(reportService.dashboard());
    }
}
