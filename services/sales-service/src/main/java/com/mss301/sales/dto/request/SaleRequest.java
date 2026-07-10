package com.mss301.sales.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record SaleRequest(
        @NotBlank @Size(max = 40) String code,
        @Size(max = 20) String saleTime,
        @Size(max = 120) String cashier,
        @NotNull @PositiveOrZero Integer items,
        @NotNull @DecimalMin("0.0") BigDecimal total,
        @Size(max = 30) String payment,
        @Size(max = 20) String status,
        // ----- Customer / loyalty / breakdown -----
        @Size(max = 30) String customerCode,
        @Size(max = 150) String customerName,
        BigDecimal subtotal,
        BigDecimal discount,
        BigDecimal vat,
        BigDecimal amountReceived,
        @PositiveOrZero Integer pointsRedeemed,
        @Valid List<SaleItemRequest> lineItems
) {
}
