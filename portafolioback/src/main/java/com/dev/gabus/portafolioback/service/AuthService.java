package com.dev.gabus.portafolioback.service;

import com.dev.gabus.portafolioback.config.security.JwtService;
import com.dev.gabus.portafolioback.model.dto.LoginRequest;
import com.dev.gabus.portafolioback.model.dto.LoginResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.username());
        String token = jwtService.generateToken(userDetails);

        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        return new LoginResponse(token, userDetails.getUsername(), role);
    }
}
