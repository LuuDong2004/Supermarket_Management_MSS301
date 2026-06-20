package com.mss301.inventory.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record InventoryItemRequest(
        @NotBlank @Size(max = 30) String code,
        @NotBlank @Size(max = 30) String productCode,
        @NotBlank @Size(max = 200) String name,
        @NotBlank @Size(max = 80) String category,
        @NotNull @PositiveOrZero Integer onHand,
        @NotNull @PositiveOrZero Integer threshold,
        @Size(max = 80) String location,
        @Size(max = 20) String unit
) {
}
