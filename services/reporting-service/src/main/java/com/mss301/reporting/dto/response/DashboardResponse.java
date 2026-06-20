package com.mss301.reporting.dto.response;

import java.math.BigDecimal;

public record DashboardResponse(
        BigDecimal todayRevenue,
        long todayOrders,
        long lowStockCount,
        long activeShifts
) {
}
