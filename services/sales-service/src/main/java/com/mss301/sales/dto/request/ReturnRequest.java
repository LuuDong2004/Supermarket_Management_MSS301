package com.mss301.sales.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record ReturnRequest(
        @Size(max = 40) String code,
        @NotBlank @Size(max = 40) String saleCode,
        @Size(max = 120) String cashier,
        @Size(max = 30) String customerCode,
        @Size(max = 20) String returnDate,
        @Size(max = 200) String reason,
        BigDecimal refundAmount,
        @Size(max = 300) String note,
        @NotEmpty @Valid List<ReturnItemRequest> lineItems
) {
}
