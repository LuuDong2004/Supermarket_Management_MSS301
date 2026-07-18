package com.mss301.user.dto.response;

import java.util.UUID;

public record FeaturePermissionResponse(
        UUID id,
        String featureCode,
        String featureName,
        String category,
        boolean ceo,
        boolean admin,
        boolean warehouseManager,
        boolean warehouseStaff,
        boolean staffManager,
        boolean cashier
) {
}
