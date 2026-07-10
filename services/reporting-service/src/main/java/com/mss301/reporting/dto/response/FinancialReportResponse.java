package com.mss301.reporting.dto.response;

public record FinancialReportResponse(
        String month,
        Integer revenue,
        Integer cost,
        Integer grossProfit,
        Integer netProfit
) {
}
