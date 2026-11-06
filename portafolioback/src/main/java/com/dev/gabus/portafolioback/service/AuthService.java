package com.dev.gabus.portafolioback.service;

import com.dev.gabus.portafolioback.config.security.JwtService;
import com.dev.gabus.portafolioback.model.dto.ChangePasswordRequest;
import com.dev.gabus.portafolioback.model.dto.LoginRequest;
import com.dev.gabus.portafolioback.model.dto.LoginResponse;
import com.dev.gabus.portafolioback.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.username());
        String token = jwtService.generateToken(userDetails);

        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        return new LoginResponse(token, userDetails.getUsername(), role);
    }

    public void changePassword(String username, ChangePasswordRequest request) {
        var admin = adminUserRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        if (!passwordEncoder.matches(request.currentPassword(), admin.getPasswordHash())) {
            throw new org.springframework.security.authentication.BadCredentialsException("La contraseña actual es incorrecta");
        }

        admin.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        adminUserRepository.save(admin);
    }
}
