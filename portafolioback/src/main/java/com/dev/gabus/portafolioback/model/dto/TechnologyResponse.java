package com.dev.gabus.portafolioback.model.dto;

import java.time.Instant;

public record TechnologyResponse(
    Long id,
    String name,
    String category,
    String icon,
    String color,
    Instant createdAt
) {}
