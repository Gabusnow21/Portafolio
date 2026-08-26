package com.dev.gabus.portafolioback.model.dto;

import java.util.Map;

public record MetricsResponse(
    long totalProjects,
    long webProjects,
    long mobileProjects,
    long totalTechnologies,
    long unreadMessages,
    Map<String, Long> projectsByStatus
) {}
