package com.mss301.inventory.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record StockCountRequest(
        @NotBlank @Size(max = 30) String code,
        @NotBlank @Size(max = 80) String location,
        @NotBlank @Size(max = 30) String status,
        @NotNull LocalDate countDate,
        @Size(max = 250) String note
) {
}
