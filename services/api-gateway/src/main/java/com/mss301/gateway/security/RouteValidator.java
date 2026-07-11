package com.mss301.gateway.security;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Decides whether a request must carry a valid JWT. Public endpoints (login,
 * register, refresh, docs) are skipped by the authentication filter.
 */
@Component
public class RouteValidator {

    private static final List<String> OPEN_PATH_PREFIXES = List.of(
            "/api/auth/login",
            "/api/auth/register",
            "/api/auth/refresh",
            "/api/auth/v3/api-docs",
            "/api/users/v3/api-docs",
            "/v3/api-docs",
            "/swagger-ui",
            "/webjars",
            "/actuator/health",
            "/actuator/info",
            "/api/sales/sepay-webhook"
    );

    public boolean isSecured(ServerHttpRequest request) {
        String path = request.getURI().getPath();
        return OPEN_PATH_PREFIXES.stream().noneMatch(path::startsWith);
    }
}
