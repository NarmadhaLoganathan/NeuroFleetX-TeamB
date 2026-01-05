package com.neurofleetx.config;

import com.neurofleetx.util.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        // Public
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Allow preflight checks
                        .requestMatchers("/api/chat/**").permitAll()

                        // --- NEW: User Management (Admin Only) ---
                        .requestMatchers("/api/users/**").hasAuthority("ADMIN")

                        // Existing Routes
                        .requestMatchers("/api/trips/**").hasAnyAuthority("ADMIN", "MANAGER", "DRIVER")
                        .requestMatchers("/api/gps/**").hasAnyAuthority("ADMIN", "MANAGER", "DRIVER")
                        .requestMatchers("/api/vehicles/user/**").hasAnyAuthority("ADMIN", "MANAGER", "DRIVER")
                        .requestMatchers("/api/vehicles/**").hasAnyAuthority("ADMIN", "MANAGER", "DRIVER")
                        .requestMatchers("/api/drivers/**").hasAnyAuthority("ADMIN", "MANAGER", "DRIVER")
                        .requestMatchers("/api/ai/**").hasAnyAuthority("ADMIN", "MANAGER", "DRIVER")
                        .requestMatchers("/api/alerts/**").hasAnyAuthority("ADMIN", "MANAGER", "DRIVER")
                        .requestMatchers("/api/traffic/**").hasAnyAuthority("MANAGER", "ADMIN")

                        .anyRequest().authenticated())
                .exceptionHandling(e -> e.authenticationEntryPoint(
                        new org.springframework.security.web.authentication.HttpStatusEntryPoint(
                                org.springframework.http.HttpStatus.UNAUTHORIZED)))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}