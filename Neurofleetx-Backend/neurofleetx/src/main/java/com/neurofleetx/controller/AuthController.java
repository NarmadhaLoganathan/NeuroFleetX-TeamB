package com.neurofleetx.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.neurofleetx.dto.LoginRequest;
import com.neurofleetx.dto.RegisterRequest;
import com.neurofleetx.entity.Driver;
import com.neurofleetx.entity.User;
import com.neurofleetx.repository.DriverRepository;
import com.neurofleetx.repository.UserRepository;
import com.neurofleetx.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    public UserRepository userRepository;

    @Autowired
    public DriverRepository driverRepository;

    @Autowired
    public PasswordEncoder passwordEncoder;

    @Autowired
    public JwtUtil jwtUtil;

    // ---------------- REGISTER ----------------
    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {

        // Validate email
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return new ResponseEntity<>("Email already registered!", HttpStatus.CONFLICT);
        }

        String role = request.getRole();

        // ---------------- DRIVER PUBLIC REGISTRATION ----------------
        if ("DRIVER".equals(role)) {

            // 1️⃣ Create User
            User user = User.builder()
                    .name(request.getName())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role("DRIVER")
                    .build();

            userRepository.save(user);

            // 2️⃣ Create Driver Profile
            Driver driver = new Driver();
            driver.setUser(user);
            driver.setName(request.getName());
            driver.setEmail(request.getEmail());
            driver.setLicenseNo(request.getLicenseNumber());
            driver.setPhone(request.getPhoneNumber());
            driver.setExperienceYears(request.getExperienceYears());
            driver.setRating(0.0);
            driver.setTotalTrips(0);

            driverRepository.save(driver);

            return new ResponseEntity<>("Driver registered successfully!", HttpStatus.CREATED);
        }

        // ---------------- ADMIN + MANAGER RESTRICTED ----------------
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return new ResponseEntity<>("Only admin can create ADMIN or MANAGER accounts!", HttpStatus.FORBIDDEN);
        }

        String token = authHeader.substring(7);
        String creatorRole = jwtUtil.extractRole(token);

        if (!"ADMIN".equals(creatorRole)) {
            return new ResponseEntity<>("Only admin can create ADMIN or MANAGER accounts!", HttpStatus.FORBIDDEN);
        }

        if (!role.equals("ADMIN") && !role.equals("MANAGER")) {
            return new ResponseEntity<>("Invalid role! Allowed roles: ADMIN, MANAGER, DRIVER", HttpStatus.BAD_REQUEST);
        }

        // Admin creates Admin/Manager
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        userRepository.save(user);

        return new ResponseEntity<>("User (" + role + ") created successfully!", HttpStatus.CREATED);
    }

    // ---------------- LOGIN ----------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());
        if (optionalUser.isEmpty() ||
                !passwordEncoder.matches(request.getPassword(), optionalUser.get().getPassword())) {
            return new ResponseEntity<>("Invalid email or password!", HttpStatus.UNAUTHORIZED);
        }

        User user = optionalUser.get();
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId());

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "role", user.getRole(),
                        "id", user.getId()
                )
        );
    }

    // ---------------- GOOGLE LOGIN ----------------
    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request) {
        try {
            String idTokenString = request.get("token");

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    new GsonFactory()
            ).setAudience(Collections.singletonList("596400670062-ge2o9okc7afst4r103nsss0lkvfiglgn.apps.googleusercontent.com"))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                String email = payload.getEmail();
                String name = (String) payload.get("name");

                Optional<User> optionalUser = userRepository.findByEmail(email);

                User user;

                if (optionalUser.isEmpty()) {
                    user = User.builder()
                            .email(email)
                            .name(name)
                            .password(passwordEncoder.encode("google-auth"))
                            .role("DRIVER")
                            .build();

                    userRepository.save(user);

                    // Create driver profile automatically
                    Driver d = new Driver();
                    d.setUser(user);
                    d.setName(name);
                    d.setEmail(email);
                    driverRepository.save(d);

                } else {
                    user = optionalUser.get();
                }

                String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId());

                return ResponseEntity.ok(
                        Map.of(
                                "token", token,
                                "role", user.getRole(),
                                "id", user.getId()
                        )
                );
            } else {
                return new ResponseEntity<>("Invalid Google token!", HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Google authentication failed!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
