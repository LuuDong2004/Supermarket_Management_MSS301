package com.mss301.security.constant;

/**
 * Identity headers injected by the API Gateway after it validates the JWT.
 * Downstream services read these instead of re-parsing the token.
 */
public final class GatewayHeaders {

    public static final String USER_ID = "X-User-Id";
    public static final String USERNAME = "X-Username";
    public static final String ROLES = "X-Roles";

    private GatewayHeaders() {
    }
}
