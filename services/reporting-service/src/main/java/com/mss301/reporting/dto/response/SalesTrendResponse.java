package com.mss301.reporting.dto.response;

public record SalesTrendResponse(
        String label,
        Integer revenue,
        Integer orders
) {
}
