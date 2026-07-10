package com.mss301.reporting.dto.response;

import java.math.BigDecimal;

public record OperationalMetricResponse(
        String area,
        Integer orders,
        Integer inventoryValue,
        BigDecimal turnoverRate,
        Integer lowStockItems,
        BigDecimal fulfillmentRate,
        Integer staffScore
) {
}
