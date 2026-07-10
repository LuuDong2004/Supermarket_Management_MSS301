package com.mss301.sales.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ShiftRequest(
        @NotBlank @Size(max = 30) String code,
        @Size(max = 120) String cashier,
        @Size(max = 30) String openAt,
        @Size(max = 30) String closeAt,
        @DecimalMin("0.0") BigDecimal opening,
        @DecimalMin("0.0") BigDecimal sales,
        @DecimalMin("0.0") BigDecimal closingActual,
        @Size(max = 255) String varianceNote,
        Integer orders,
        @Size(max = 20) String status
) {
}
