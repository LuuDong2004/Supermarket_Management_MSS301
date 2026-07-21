package com.mss301.product.dto.response;

import java.util.UUID;

public record CategoryResponse(
        UUID id,
        String name,
        String description,
        boolean active,
        boolean requiresExpiry,
        String taxGroup
) {
}
