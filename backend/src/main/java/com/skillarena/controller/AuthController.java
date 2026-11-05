package com.skillarena.controller;

import com.skillarena.dto.AuthDTO;
import com.skillarena.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthDTO.AuthResponse> login(@RequestBody AuthDTO.LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthDTO.AuthResponse> register(@RequestBody AuthDTO.RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @GetMapping("/demo-token")
    public ResponseEntity<AuthDTO.AuthResponse> getDemoStudentToken() {
        AuthDTO.LoginRequest req = new AuthDTO.LoginRequest("student@skillarena.ai", "password123");
        try {
            return ResponseEntity.ok(authService.login(req));
        } catch (Exception e) {
            // Return immediate demo student profile
            return ResponseEntity.ok(AuthDTO.AuthResponse.builder()
                    .token("demo-jwt-token-anisha")
                    .userId(1L)
                    .email("student@skillarena.ai")
                    .name("Anisha Rai")
                    .role(com.skillarena.model.Role.STUDENT)
                    .targetRole("Cloud & Fullstack Software Engineer")
                    .currentReadinessScore(java.math.BigDecimal.valueOf(78.5))
                    .build());
        }
    }
}

