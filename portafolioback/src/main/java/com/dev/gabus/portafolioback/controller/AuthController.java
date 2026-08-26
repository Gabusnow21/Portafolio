package com.dev.gabus.portafolioback.controller;

import com.dev.gabus.portafolioback.model.dto.LoginRequest;
import com.dev.gabus.portafolioback.model.dto.LoginResponse;
import com.dev.gabus.portafolioback.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
