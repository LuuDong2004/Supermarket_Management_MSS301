package com.mss301.inventory.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record StockAdjustmentRequest(
        @NotBlank @Size(max = 30) String code,
        @NotBlank @Size(max = 200) String product,
        @NotNull Integer systemQty,
        @NotNull Integer countedQty,
        @NotNull Integer diff,
        @Size(max = 150) String reason,
        @NotNull LocalDate adjDate,
        @NotBlank @Size(max = 30) String status,
        @Size(max = 255) String evidenceName,
        @Size(max = 500) String decisionComment
) {
}
