package com.dev.gabus.portafolioback.controller;

import com.dev.gabus.portafolioback.model.dto.ChangePasswordRequest;
import com.dev.gabus.portafolioback.model.dto.LoginRequest;
import com.dev.gabus.portafolioback.model.dto.LoginResponse;
import com.dev.gabus.portafolioback.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(Authentication authentication,
                                              @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(authentication.getName(), request);
        return ResponseEntity.noContent().build();
    }
}
