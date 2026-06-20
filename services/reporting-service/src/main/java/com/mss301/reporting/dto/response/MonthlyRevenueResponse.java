package com.mss301.reporting.dto.response;

public record MonthlyRevenueResponse(
        String month,
        Integer revenue,
        Integer target
) {
}
