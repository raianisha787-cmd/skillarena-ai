package com.skillarena.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessment_attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "assessment_id", nullable = false)
    private Long assessmentId;

    @Column(name = "assessment_title")
    private String assessmentTitle;

    @Column(name = "score_obtained", nullable = false)
    private BigDecimal scoreObtained;

    @Column(name = "total_possible", nullable = false)
    private BigDecimal totalPossible;

    @Column(nullable = false)
    private BigDecimal percentage;

    @Column(name = "campus_percentile")
    @Builder.Default
    private BigDecimal campusPercentile = BigDecimal.valueOf(50.0);

    @Column(name = "time_taken_seconds")
    private Integer timeTakenSeconds;

    @Column(length = 30)
    @Builder.Default
    private String status = "EVALUATED";

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

