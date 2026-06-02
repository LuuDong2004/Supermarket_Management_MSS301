package com.mss301.common.exception;

import org.springframework.http.HttpStatus;

/**
 * Central registry of business/technical error codes. Each code carries the
 * HTTP status it maps to and a default human-readable message.
 */
public enum ErrorCode {

    // 400
    VALIDATION_ERROR(HttpStatus.BAD_REQUEST, "Validation failed"),
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "Bad request"),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "Invalid username or password"),

    // 401 / 403
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "Authentication required"),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "Token is invalid or expired"),
    REFRESH_TOKEN_INVALID(HttpStatus.UNAUTHORIZED, "Refresh token is invalid, expired or revoked"),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "You do not have permission to access this resource"),
    ACCOUNT_DISABLED(HttpStatus.FORBIDDEN, "Account is not active"),

    // 404
    RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND, "Resource not found"),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "User not found"),

    // 409
    CONFLICT(HttpStatus.CONFLICT, "Resource conflict"),
    USERNAME_ALREADY_EXISTS(HttpStatus.CONFLICT, "Username already exists"),
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "Email already exists"),

    // 5xx
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected internal error"),
    SERVICE_UNAVAILABLE(HttpStatus.SERVICE_UNAVAILABLE, "Downstream service unavailable");

    private final HttpStatus status;
    private final String defaultMessage;

    ErrorCode(HttpStatus status, String defaultMessage) {
        this.status = status;
        this.defaultMessage = defaultMessage;
    }

    public HttpStatus status() {
        return status;
    }

    public String defaultMessage() {
        return defaultMessage;
    }
}
