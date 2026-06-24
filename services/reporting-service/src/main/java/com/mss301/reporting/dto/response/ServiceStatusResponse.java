package com.mss301.reporting.dto.response;

import java.util.UUID;

public record ServiceStatusResponse(
        UUID id,
        String name,
        Integer port,
        String status,
        String uptime,
        Integer cpu,
        Integer mem
) {
}
