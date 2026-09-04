package com.dev.gabus.portafolioback.config.security;

import com.dev.gabus.portafolioback.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminUserRepository adminUserRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var admin = adminUserRepository.findByUsername(username)
            .or(() -> adminUserRepository.findByEmail(username))
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        return new User(
            admin.getUsername(),
            admin.getPasswordHash(),
            admin.getEnabled(),
            true, true, true,
            List.of(new SimpleGrantedAuthority("ROLE_" + admin.getRole()))
        );
    }
}
