package com.mss301.user.dto.request;

import jakarta.validation.constraints.NotNull;

/**
 * Full permission row update for the matrix toggle (UC-A02).
 */
public record FeaturePermissionRequest(
        @NotNull Boolean ceo,
        @NotNull Boolean admin,
        @NotNull Boolean warehouseManager,
        @NotNull Boolean warehouseStaff,
        @NotNull Boolean cashier
) {
}
