package com.skillarena.service;

import com.skillarena.dto.AnalyticsDTO;
import com.skillarena.model.User;
import com.skillarena.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final UserRepository userRepository;

    public AnalyticsDTO.CampusSummary getCampusSummary() {
        List<User> students = userRepository.findAll().stream()
                .filter(u -> u.getRole() == com.skillarena.model.Role.STUDENT)
                .toList();

        int totalStudents = students.size();
        BigDecimal avgScore = BigDecimal.valueOf(73.5);
        if (totalStudents > 0) {
            BigDecimal sum = students.stream()
                    .map(User::getCurrentReadinessScore)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            avgScore = sum.divide(BigDecimal.valueOf(totalStudents), 1, RoundingMode.HALF_UP);
        }

        List<AnalyticsDTO.DepartmentMetric> departments = List.of(
            AnalyticsDTO.DepartmentMetric.builder()
                .departmentName("Computer Science & Engineering")
                .studentCount(180)
                .averageScore(BigDecimal.valueOf(76.8))
                .topStrength("Data Structures & Algorithms")
                .build(),
            AnalyticsDTO.DepartmentMetric.builder()
                .departmentName("Information Technology & AI")
                .studentCount(120)
                .averageScore(BigDecimal.valueOf(74.2))
                .topStrength("Python & Machine Learning")
                .build(),
            AnalyticsDTO.DepartmentMetric.builder()
                .departmentName("Electronics & Communication")
                .studentCount(95)
                .averageScore(BigDecimal.valueOf(68.5))
                .topStrength("Embedded Systems & Core Java")
                .build()
        );

        List<AnalyticsDTO.StudentLeaderboardEntry> topPerformers = List.of(
            AnalyticsDTO.StudentLeaderboardEntry.builder()
                .userId(1L)
                .name("Anisha Rai")
                .department("Computer Science & Engineering")
                .readinessScore(BigDecimal.valueOf(92.4))
                .percentile(BigDecimal.valueOf(98.6))
                .targetRole("Full-Stack Software Engineer")
                .build(),
            AnalyticsDTO.StudentLeaderboardEntry.builder()
                .userId(2L)
                .name("Ananya Iyer")
                .department("Information Technology & AI")
                .readinessScore(BigDecimal.valueOf(89.8))
                .percentile(BigDecimal.valueOf(96.2))
                .targetRole("AI/ML & Data Engineer")
                .build(),
            AnalyticsDTO.StudentLeaderboardEntry.builder()
                .userId(3L)
                .name("Rohan Verma")
                .department("Computer Science & Engineering")
                .readinessScore(BigDecimal.valueOf(87.5))
                .percentile(BigDecimal.valueOf(94.0))
                .targetRole("Cloud & DevOps Engineer")
                .build()
        );

        return AnalyticsDTO.CampusSummary.builder()
                .campusName("National Institute of Technology & Engineering")
                .totalStudents(totalStudents > 0 ? totalStudents : 395)
                .averageReadinessScore(avgScore)
                .placementReadinessRate(BigDecimal.valueOf(82.4))
                .departments(departments)
                .topPerformers(topPerformers)
                .build();
    }
}

