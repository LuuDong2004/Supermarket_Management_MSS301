package com.mss301.supplier.security;

import java.util.UUID;

/**
 * Authenticated principal reconstructed from gateway headers.
 */
public record GatewayUser(String id, String username) {

    public UUID uuid() {
        return UUID.fromString(id);
    }
}
