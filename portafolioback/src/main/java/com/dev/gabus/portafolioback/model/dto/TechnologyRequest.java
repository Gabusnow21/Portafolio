package com.dev.gabus.portafolioback.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TechnologyRequest(
    @NotBlank @Size(max = 60) String name,
    @NotBlank @Size(max = 40) String category,
    @Size(max = 255) String icon,
    @Size(max = 9) String color
) {}
