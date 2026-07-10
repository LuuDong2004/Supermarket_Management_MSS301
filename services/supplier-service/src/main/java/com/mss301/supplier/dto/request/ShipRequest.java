package com.mss301.supplier.dto.request;

import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/** Supplier marks a PO as shipping, with an expected delivery date and note. */
public record ShipRequest(
        LocalDate expectedDelivery,
        @Size(max = 255) String note
) {
}
