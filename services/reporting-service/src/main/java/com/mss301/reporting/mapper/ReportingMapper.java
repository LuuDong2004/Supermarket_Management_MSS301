package com.mss301.reporting.mapper;

import com.mss301.reporting.dto.request.StrategicDecisionRequest;
import com.mss301.reporting.dto.response.CategoryShareResponse;
import com.mss301.reporting.dto.response.EmployeePerformanceResponse;
import com.mss301.reporting.dto.response.FinancialReportResponse;
import com.mss301.reporting.dto.response.MonthlyRevenueResponse;
import com.mss301.reporting.dto.response.OperationalMetricResponse;
import com.mss301.reporting.dto.response.SalesTrendResponse;
import com.mss301.reporting.dto.response.SecurityAlertResponse;
import com.mss301.reporting.dto.response.ServiceStatusResponse;
import com.mss301.reporting.dto.response.StrategicDecisionResponse;
import com.mss301.reporting.dto.response.SystemLogResponse;
import com.mss301.reporting.entity.CategoryShare;
import com.mss301.reporting.entity.EmployeePerformance;
import com.mss301.reporting.entity.FinancialReport;
import com.mss301.reporting.entity.MonthlyRevenue;
import com.mss301.reporting.entity.OperationalMetric;
import com.mss301.reporting.entity.SalesTrendPoint;
import com.mss301.reporting.entity.SecurityAlert;
import com.mss301.reporting.entity.ServiceStatus;
import com.mss301.reporting.entity.StrategicDecision;
import com.mss301.reporting.entity.SystemLog;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ReportingMapper {

    SalesTrendResponse toResponse(SalesTrendPoint point);

    CategoryShareResponse toResponse(CategoryShare categoryShare);

    EmployeePerformanceResponse toResponse(EmployeePerformance performance);

    MonthlyRevenueResponse toResponse(MonthlyRevenue monthlyRevenue);

    FinancialReportResponse toResponse(FinancialReport financialReport);

    OperationalMetricResponse toResponse(OperationalMetric operationalMetric);

    ServiceStatusResponse toResponse(ServiceStatus serviceStatus);

    SystemLogResponse toResponse(SystemLog systemLog);

    SecurityAlertResponse toResponse(SecurityAlert securityAlert);

    // ----- Strategic decisions (UC-CEO07) -----
    StrategicDecisionResponse toResponse(StrategicDecision decision);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    StrategicDecision toEntity(StrategicDecisionRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    void update(@MappingTarget StrategicDecision decision, StrategicDecisionRequest request);
}
