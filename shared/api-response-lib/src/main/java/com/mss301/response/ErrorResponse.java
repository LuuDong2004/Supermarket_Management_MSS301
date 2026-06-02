package com.mss301.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.Map;

/**
 * Structured error payload. Carried inside {@link ApiResponse#data()} for
 * validation/field-level failures so clients get machine-readable details.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
        String code,
        String detail,
        Map<String, String> fieldErrors,
        Instant timestamp
) {
    public static ErrorResponse of(String code, String detail) {
        return new ErrorResponse(code, detail, null, Instant.now());
    }

    public static ErrorResponse of(String code, String detail, Map<String, String> fieldErrors) {
        return new ErrorResponse(code, detail, fieldErrors, Instant.now());
    }
}
