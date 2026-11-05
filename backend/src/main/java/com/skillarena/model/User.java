package com.skillarena.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 180)
    private String email;

    @Column(nullable = false, name = "password_hash")
    private String password;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "campus_id")
    private Long campusId;

    @Column(name = "department_id")
    private Long departmentId;

    @Column(name = "roll_number")
    private String rollNumber;

    @Column(name = "graduation_year")
    private Integer graduationYear;

    @Column(name = "target_role")
    @Builder.Default
    private String targetRole = "Full-Stack Software Engineer";

    @Column(name = "current_readiness_score")
    @Builder.Default
    private BigDecimal currentReadinessScore = BigDecimal.valueOf(0.0);

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

