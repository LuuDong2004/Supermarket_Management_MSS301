package com.mss301.reporting.mapper;

import com.mss301.reporting.dto.response.CategoryShareResponse;
import com.mss301.reporting.dto.response.EmployeePerformanceResponse;
import com.mss301.reporting.dto.response.MonthlyRevenueResponse;
import com.mss301.reporting.dto.response.SalesTrendResponse;
import com.mss301.reporting.dto.response.ServiceStatusResponse;
import com.mss301.reporting.dto.response.SystemLogResponse;
import com.mss301.reporting.entity.CategoryShare;
import com.mss301.reporting.entity.EmployeePerformance;
import com.mss301.reporting.entity.MonthlyRevenue;
import com.mss301.reporting.entity.SalesTrendPoint;
import com.mss301.reporting.entity.ServiceStatus;
import com.mss301.reporting.entity.SystemLog;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ReportingMapper {

    SalesTrendResponse toResponse(SalesTrendPoint point);

    CategoryShareResponse toResponse(CategoryShare categoryShare);

    EmployeePerformanceResponse toResponse(EmployeePerformance performance);

    MonthlyRevenueResponse toResponse(MonthlyRevenue monthlyRevenue);

    ServiceStatusResponse toResponse(ServiceStatus serviceStatus);

    SystemLogResponse toResponse(SystemLog systemLog);
}
