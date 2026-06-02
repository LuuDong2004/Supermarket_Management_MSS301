package com.mss301.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;

/**
 * Standard envelope returned by every REST endpoint in the platform.
 *
 * <pre>
 * {
 *   "success": true,
 *   "message": "Login successful",
 *   "data": {},
 *   "timestamp": "2026-05-29T10:15:30Z"
 * }
 * </pre>
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(
        boolean success,
        String message,
        T data,
        Instant timestamp
) {

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, Instant.now());
    }

    public static <T> ApiResponse<T> success(T data) {
        return success("Success", data);
    }

    public static ApiResponse<Void> success(String message) {
        return new ApiResponse<>(true, message, null, Instant.now());
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, Instant.now());
    }

    public static <T> ApiResponse<T> error(String message, T data) {
        return new ApiResponse<>(false, message, data, Instant.now());
    }
}
