package com.neurofleetx.util;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        System.out.println("JwtAuthFilter: Processing request " + request.getRequestURI());

        // No token → continue
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("JwtAuthFilter: No Bearer token found in header: " + authHeader);
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            // Use JwtUtil to extract claims (ensures consistent key usage)
            String username = jwtUtil.extractUsername(token);
            String role = jwtUtil.extractRole(token);

            System.out.println("JwtAuthFilter: Token valid. User: " + username + ", Role: " + role);

            // Only authenticate if no auth exists already
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role);

                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        Collections.singletonList(authority));

                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(auth);
            }

        } catch (Exception e) {
            // DO NOT set 403 here — just ignore the token
            // Invalid token → user stays unauthenticated
            System.out.println("JwtAuthFilter: Token parsing failed: " + e.getMessage());
            e.printStackTrace();
        }

        filterChain.doFilter(request, response);
    }
}
