package com.mss301.reporting.dto.response;

import java.util.UUID;

public record SecurityAlertResponse(
        UUID id,
        String code,
        String type,
        String severity,
        String source,
        String actor,
        String ipAddress,
        String detectedAt,
        String status,
        String note
) {
}
