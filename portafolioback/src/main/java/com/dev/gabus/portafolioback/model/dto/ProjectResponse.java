package com.dev.gabus.portafolioback.model.dto;

import com.dev.gabus.portafolioback.model.enums.ProjectStatus;
import com.dev.gabus.portafolioback.model.enums.ProjectType;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;

public record ProjectResponse(
    Long id,
    String title,
    String slug,
    String shortDescription,
    String description,
    ProjectType type,
    ProjectStatus status,
    String repoUrl,
    String demoUrl,
    String imageUrl,
    Boolean featured,
    LocalDate startDate,
    LocalDate endDate,
    Integer viewsCount,
    Set<TechnologyResponse> technologies,
    Instant createdAt,
    Instant updatedAt
) {}
