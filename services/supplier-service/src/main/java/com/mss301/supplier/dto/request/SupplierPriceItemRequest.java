package com.mss301.supplier.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record SupplierPriceItemRequest(
        @Size(max = 40) String code,
        @NotBlank @Size(max = 200) String productName,
        @Size(max = 30) String unit,
        @PositiveOrZero BigDecimal price,
        @PositiveOrZero Integer moq,
        @Size(max = 20) String status,
        @Size(max = 255) String note
) {
}
