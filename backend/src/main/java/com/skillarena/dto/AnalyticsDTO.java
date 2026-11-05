package com.skillarena.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class AnalyticsDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CampusSummary {
        private String campusName;
        private Integer totalStudents;
        private BigDecimal averageReadinessScore;
        private BigDecimal placementReadinessRate;
        private List<DepartmentMetric> departments;
        private List<StudentLeaderboardEntry> topPerformers;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DepartmentMetric {
        private String departmentName;
        private Integer studentCount;
        private BigDecimal averageScore;
        private String topStrength;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StudentLeaderboardEntry {
        private Long userId;
        private String name;
        private String department;
        private BigDecimal readinessScore;
        private BigDecimal percentile;
        private String targetRole;
    }
}

