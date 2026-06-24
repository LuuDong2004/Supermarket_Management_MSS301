package com.mss301.reporting.dto.response;

import java.util.UUID;

public record SystemLogResponse(
        UUID id,
        String code,
        String time,
        String level,
        String service,
        String message,
        String actor
) {
}
