package com.dev.gabus.portafolioback.model.dto;

import com.dev.gabus.portafolioback.model.enums.ProjectStatus;
import com.dev.gabus.portafolioback.model.enums.ProjectType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.Set;

public record CreateProjectRequest(
    @NotBlank @Size(max = 120) String title,
    @NotBlank @Size(max = 200) String shortDescription,
    @NotBlank String description,
    @NotNull ProjectType type,
    ProjectStatus status,
    String repoUrl,
    String demoUrl,
    String imageUrl,
    Boolean featured,
    LocalDate startDate,
    LocalDate endDate,
    Set<Long> technologyIds
) {
    public CreateProjectRequest {
        if (status == null) status = ProjectStatus.COMPLETED;
        if (featured == null) featured = false;
    }
}
