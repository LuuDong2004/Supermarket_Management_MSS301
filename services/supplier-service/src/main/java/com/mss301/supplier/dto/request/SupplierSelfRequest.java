package com.mss301.supplier.dto.request;

import jakarta.validation.constraints.Size;

/** Fields a supplier may update on their own profile (UC supplier profile). */
public record SupplierSelfRequest(
        @Size(max = 100) String contact,
        @Size(max = 30) String phone,
        @Size(max = 100) String email,
        @Size(max = 255) String address,
        @Size(max = 30) String terms
) {
}
