package com.mss301.event.user;

import com.mss301.event.DomainEvent;

import java.time.Instant;

/**
 * Sample contract: emitted when a new user is registered. Future services
 * (e.g. notification-service) consume this to trigger welcome workflows.
 */
public record UserRegisteredEvent(
        String eventId,
        Instant occurredAt,
        String userId,
        String username,
        String email,
        String role
) implements DomainEvent {

    public static final String TYPE = "user.registered";

    @Override
    public String eventType() {
        return TYPE;
    }
}
