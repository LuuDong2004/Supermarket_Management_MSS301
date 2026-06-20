package com.mss301.inventory.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record WarehouseTransactionRequest(
        @NotBlank @Size(max = 30) String code,
        @NotBlank @Size(max = 30) String type,
        @Size(max = 40) String ref,
        @NotBlank @Size(max = 200) String product,
        @NotNull Integer qty,
        @NotNull LocalDate txnDate,
        @NotBlank @Size(max = 30) String status
) {
}
