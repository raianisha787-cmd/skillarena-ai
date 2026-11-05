package com.skillarena.dto;

import com.skillarena.model.Role;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class AuthDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        private String email;
        private String password;
        private String firstName;
        private String lastName;
        private Role role;
        private String rollNumber;
        private Integer graduationYear;
        private String targetRole;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuthResponse {
        private String token;
        private String type = "Bearer";
        private Long userId;
        private String email;
        private String name;
        private Role role;
        private String targetRole;
        private BigDecimal currentReadinessScore;
    }
}

