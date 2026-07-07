package com.mss301.sales.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;

@JsonIgnoreProperties(ignoreUnknown = true)
public record SePayWebhookRequest(
        Long id,
        String gateway,
        String transactionDate,
        String accountNumber,
        String subAccount,
        @JsonAlias("transferAmount")
        BigDecimal amountIn,
        BigDecimal amountOut,
        @JsonAlias("accumulated")
        BigDecimal accumulatedBalance,
        String code,
        @JsonAlias({"content", "description"})
        String transactionContent,
        @JsonAlias("referenceCode")
        String referenceNumber,
        String body,
        String transferType
) {
}
