package com.mss301.reporting.dto.request;

import jakarta.validation.constraints.NotBlank;

public record SystemLogRequest(
        @NotBlank String level,
        @NotBlank String service,
        @NotBlank String message,
        String actor
) {
}
