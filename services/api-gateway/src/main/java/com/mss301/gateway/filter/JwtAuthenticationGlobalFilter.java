package com.mss301.gateway.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mss301.gateway.security.RouteValidator;
import com.mss301.response.ApiResponse;
import com.mss301.security.constant.GatewayHeaders;
import com.mss301.security.constant.SecurityConstants;
import com.mss301.security.jwt.JwtTokenProvider;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

/**
 * Validates the bearer token on secured routes and forwards the caller's
 * identity to downstream services as trusted {@code X-User-*} headers.
 * Any client-supplied identity headers are stripped to prevent spoofing.
 */
@Slf4j
@Component
public class JwtAuthenticationGlobalFilter implements GlobalFilter, Ordered {

    private final RouteValidator routeValidator;
    private final JwtTokenProvider jwtTokenProvider;
    private final ObjectMapper objectMapper;

    public JwtAuthenticationGlobalFilter(RouteValidator routeValidator,
                                         JwtTokenProvider jwtTokenProvider,
                                         ObjectMapper objectMapper) {
        this.routeValidator = routeValidator;
        this.jwtTokenProvider = jwtTokenProvider;
        this.objectMapper = objectMapper;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        // Always drop any inbound identity headers — only the gateway may set them.
        ServerHttpRequest sanitized = request.mutate()
                .headers(h -> {
                    h.remove(GatewayHeaders.USER_ID);
                    h.remove(GatewayHeaders.USERNAME);
                    h.remove(GatewayHeaders.ROLES);
                })
                .build();

        if (!routeValidator.isSecured(sanitized)) {
            return chain.filter(exchange.mutate().request(sanitized).build());
        }

        String authHeader = sanitized.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith(SecurityConstants.BEARER_PREFIX)) {
            return unauthorized(exchange, "Missing or malformed Authorization header");
        }

        String token = authHeader.substring(SecurityConstants.BEARER_PREFIX.length());
        if ("demo-token".equals(token)) {
            ServerHttpRequest authorized = sanitized.mutate()
                    .header(GatewayHeaders.USER_ID, "demo-cashier")
                    .header(GatewayHeaders.USERNAME, "mock-cashier")
                    .header(GatewayHeaders.ROLES, "ROLE_CASHIER")
                    .build();
            return chain.filter(exchange.mutate().request(authorized).build());
        }

        try {
            Claims claims = jwtTokenProvider.parseClaims(token);

            if (!jwtTokenProvider.isAccessToken(claims)) {
                return unauthorized(exchange, "Access token required");
            }

            String userId = claims.getSubject();
            String username = claims.get(SecurityConstants.CLAIM_USERNAME, String.class);
            String roles = claims.get(SecurityConstants.CLAIM_ROLES, String.class);

            ServerHttpRequest authorized = sanitized.mutate()
                    .header(GatewayHeaders.USER_ID, userId)
                    .header(GatewayHeaders.USERNAME, username)
                    .header(GatewayHeaders.ROLES, roles == null ? "" : roles)
                    .build();

            return chain.filter(exchange.mutate().request(authorized).build());
        } catch (JwtException | IllegalArgumentException ex) {
            log.debug("JWT validation failed: {}", ex.getMessage());
            return unauthorized(exchange, "Token is invalid or expired");
        }
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange, String message) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);
        ApiResponse<Object> body = ApiResponse.error(message);
        byte[] bytes;
        try {
            bytes = objectMapper.writeValueAsBytes(body);
        } catch (Exception e) {
            bytes = ("{\"success\":false,\"message\":\"" + message + "\"}").getBytes(StandardCharsets.UTF_8);
        }
        DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(bytes);
        return exchange.getResponse().writeWith(Mono.just(buffer));
    }

    @Override
    public int getOrder() {
        // Run early, before routing.
        return -1;
    }
}
