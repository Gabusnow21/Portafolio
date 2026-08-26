package com.dev.gabus.portafolioback.model.dto;

import java.time.Instant;

public record ContactMessageResponse(
    Long id,
    String name,
    String email,
    String subject,
    String message,
    Boolean isRead,
    Boolean archived,
    Instant createdAt
) {}
