package com.dev.gabus.portafolioback.model.dto;

public record LoginResponse(
    String token,
    String username,
    String role
) {}
