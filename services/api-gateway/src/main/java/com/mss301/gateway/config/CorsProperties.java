package com.mss301.gateway.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "cors")
public record CorsProperties(
        List<String> allowedOrigins
) {
    public CorsProperties {
        // No wildcard fallback: CORS_ALLOWED_ORIGINS must name the real frontend
        // origin(s). "*" with allowCredentials would let any site call the API
        // on behalf of a logged-in user.
        if (allowedOrigins == null || allowedOrigins.isEmpty()) {
            throw new IllegalStateException("cors.allowed-origins must be set (CORS_ALLOWED_ORIGINS)");
        }
        if (allowedOrigins.contains("*")) {
            throw new IllegalStateException("cors.allowed-origins must not be '*' — credentials are allowed");
        }
    }
}
