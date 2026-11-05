package com.skillarena.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "assessments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "domain_id", nullable = false)
    private Long domainId;

    @Column(name = "domain_name")
    @Builder.Default
    private String domainName = "Software Engineering";

    @Column(length = 50)
    @Builder.Default
    private String difficulty = "INTERMEDIATE";

    @Column(name = "duration_minutes")
    @Builder.Default
    private Integer durationMinutes = 30;

    @Column(name = "total_marks")
    @Builder.Default
    private Integer totalMarks = 40;

    @Column(name = "passing_percentage")
    @Builder.Default
    private BigDecimal passingPercentage = BigDecimal.valueOf(60.0);

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @OneToMany(mappedBy = "assessment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Question> questions = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

