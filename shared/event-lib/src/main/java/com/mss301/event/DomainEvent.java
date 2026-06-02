package com.mss301.event;

import java.time.Instant;

/**
 * Marker contract every published domain event implements. Gives consumers a
 * stable envelope (id, type, timestamp) regardless of the broker in use.
 */
public interface DomainEvent {

    String eventId();

    String eventType();

    Instant occurredAt();
}
