package com.mss301.reporting.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record EmployeePerformanceResponse(
        UUID id,
        String name,
        Integer sales,
        BigDecimal accuracy,
        Integer hours,
        Integer score
) {
}
