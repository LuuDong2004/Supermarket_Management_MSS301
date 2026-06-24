package com.mss301.sales.dto.request;

import jakarta.validation.constraints.NotNull;

public record PointsRequest(
        @NotNull Integer delta
) {
}
