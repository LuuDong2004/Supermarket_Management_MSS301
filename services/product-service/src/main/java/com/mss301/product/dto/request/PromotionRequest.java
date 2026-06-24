package com.mss301.product.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record PromotionRequest(
        @NotBlank @Size(max = 30) String code,
        @NotBlank @Size(max = 150) String name,
        @NotBlank @Size(max = 120) String scope,
        @NotNull @PositiveOrZero Integer discount,
        @NotBlank @Size(max = 20) String type,
        @NotNull LocalDate fromDate,
        @NotNull LocalDate toDate,
        @NotBlank @Size(max = 30) String status
) {
}
