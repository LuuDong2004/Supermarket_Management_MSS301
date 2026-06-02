package com.mss301.security.constant;

/**
 * Shared JWT/auth constants so token producers (auth-service) and consumers
 * (api-gateway) agree on claim names and formats.
 */
public final class SecurityConstants {

    public static final String BEARER_PREFIX = "Bearer ";

    public static final String CLAIM_USERNAME = "username";
    public static final String CLAIM_ROLES = "roles";
    public static final String CLAIM_TYPE = "type";

    public static final String TOKEN_TYPE_ACCESS = "access";

    private SecurityConstants() {
    }
}
