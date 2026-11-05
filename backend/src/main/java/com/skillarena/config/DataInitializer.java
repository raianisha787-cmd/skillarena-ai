package com.skillarena.config;

import com.skillarena.model.*;
import com.skillarena.repository.AssessmentAttemptRepository;
import com.skillarena.repository.AssessmentRepository;
import com.skillarena.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AssessmentRepository assessmentRepository;
    private final AssessmentAttemptRepository attemptRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Checking SkillArena AI database initialization status...");

        // 1. Seed Users if absent
        if (userRepository.count() == 0) {
            log.info("Seeding default demo users (Student & TPO)...");
            User student = User.builder()
                    .email("student@skillarena.ai")
                    .password(passwordEncoder.encode("password123"))
                    .firstName("Anisha")
                    .lastName("Rai")
                    .role(Role.STUDENT)
                    .campusId(1L)
                    .departmentId(1L)
                    .rollNumber("CS2026-042")
                    .graduationYear(2026)
                    .targetRole("Full-Stack Software Engineer")
                    .currentReadinessScore(BigDecimal.valueOf(78.5))
                    .createdAt(LocalDateTime.now())
                    .build();

            User tpo = User.builder()
                    .email("tpo@skillarena.ai")
                    .password(passwordEncoder.encode("password123"))
                    .firstName("Dr. Priya")
                    .lastName("Nair")
                    .role(Role.TPO)
                    .campusId(1L)
                    .departmentId(1L)
                    .rollNumber("TPO-HEAD")
                    .graduationYear(2015)
                    .targetRole("Placement Director")
                    .currentReadinessScore(BigDecimal.valueOf(95.0))
                    .createdAt(LocalDateTime.now())
                    .build();

            userRepository.saveAll(List.of(student, tpo));
        }

        // 2. Seed Assessments & Questions if absent
        if (assessmentRepository.count() == 0) {
            log.info("Seeding comprehensive campus assessments and question banks...");

            // Assessment 1: Full-Stack Java & Cloud
            Assessment test1 = Assessment.builder()
                    .title("Full-Stack Java & Cloud Readiness Sprint")
                    .description("Evaluates core Java design patterns, Spring Boot REST architecture, SQL query performance, and containerization.")
                    .domainId(2L)
                    .domainName("Software Engineering & Cloud")
                    .difficulty("INTERMEDIATE")
                    .durationMinutes(15)
                    .totalMarks(40)
                    .passingPercentage(BigDecimal.valueOf(60.0))
                    .isActive(true)
                    .build();

            Question q1 = Question.builder()
                    .assessment(test1)
                    .questionText("In Spring Boot, which annotation is recommended for injecting configuration properties mapped from application.yml with type safety?")
                    .subSkill("Spring Boot Architecture")
                    .difficulty("EASY")
                    .points(10)
                    .explanation("@ConfigurationProperties provides strong type checking and IDE autocomplete.")
                    .build();

            QuestionOption o1_1 = QuestionOption.builder().question(q1).optionText("@Value(\"${property.name}\")").isCorrect(false).build();
            QuestionOption o1_2 = QuestionOption.builder().question(q1).optionText("@ConfigurationProperties(prefix = \"app\")").isCorrect(true).build();
            QuestionOption o1_3 = QuestionOption.builder().question(q1).optionText("@PropertySource(\"classpath:app.properties\")").isCorrect(false).build();
            QuestionOption o1_4 = QuestionOption.builder().question(q1).optionText("@Autowired Environment env").isCorrect(false).build();
            q1.setOptions(List.of(o1_1, o1_2, o1_3, o1_4));

            Question q2 = Question.builder()
                    .assessment(test1)
                    .questionText("How does JWT (JSON Web Token) guarantee token integrity between the client and Spring Boot backend?")
                    .subSkill("Security & JWT")
                    .difficulty("MEDIUM")
                    .points(10)
                    .explanation("The cryptographic signature computed over header + payload using HMAC-SHA256 guarantees integrity.")
                    .build();

            QuestionOption o2_1 = QuestionOption.builder().question(q2).optionText("By encrypting the entire token body with asymmetric keys only").isCorrect(false).build();
            QuestionOption o2_2 = QuestionOption.builder().question(q2).optionText("By appending a cryptographic signature computed over header + payload using HMAC-SHA256 or RSA").isCorrect(true).build();
            QuestionOption o2_3 = QuestionOption.builder().question(q2).optionText("By storing the session ID in a server-side Redis cache").isCorrect(false).build();
            QuestionOption o2_4 = QuestionOption.builder().question(q2).optionText("By base64-encoding the username and password in the Authorization header").isCorrect(false).build();
            q2.setOptions(List.of(o2_1, o2_2, o2_3, o2_4));

            Question q3 = Question.builder()
                    .assessment(test1)
                    .questionText("What is the most effective database index strategy for a query filtering by (campus_id, graduation_year) and sorting by readiness_score DESC?")
                    .codeSnippet("SELECT * FROM users WHERE campus_id = ? AND graduation_year = ? ORDER BY current_readiness_score DESC;")
                    .subSkill("MySQL Query Optimization")
                    .difficulty("HARD")
                    .points(10)
                    .explanation("A composite B-Tree index on (campus_id, graduation_year, current_readiness_score DESC) eliminates file-sort.")
                    .build();

            QuestionOption o3_1 = QuestionOption.builder().question(q3).optionText("Three independent single-column indexes on each field").isCorrect(false).build();
            QuestionOption o3_2 = QuestionOption.builder().question(q3).optionText("Composite index: (campus_id, graduation_year, current_readiness_score)").isCorrect(true).build();
            QuestionOption o3_3 = QuestionOption.builder().question(q3).optionText("Index on current_readiness_score only").isCorrect(false).build();
            QuestionOption o3_4 = QuestionOption.builder().question(q3).optionText("Clustered primary key indexing only").isCorrect(false).build();
            q3.setOptions(List.of(o3_1, o3_2, o3_3, o3_4));

            Question q4 = Question.builder()
                    .assessment(test1)
                    .questionText("In a multi-stage Dockerfile for a Spring Boot and React application, why is multi-staging critical?")
                    .subSkill("DevOps & Containerization")
                    .difficulty("MEDIUM")
                    .points(10)
                    .explanation("It separates build tools (Maven, Node) from slim runtime containers (JRE, Nginx), minimizing image size and attack surface.")
                    .build();

            QuestionOption o4_1 = QuestionOption.builder().question(q4).optionText("It allows executing build steps faster inside the JVM directly").isCorrect(false).build();
            QuestionOption o4_2 = QuestionOption.builder().question(q4).optionText("It keeps heavy build tooling (JDK, npm cache) out of the final slim runtime container").isCorrect(true).build();
            QuestionOption o4_3 = QuestionOption.builder().question(q4).optionText("It automatically provisions Kubernetes clusters").isCorrect(false).build();
            QuestionOption o4_4 = QuestionOption.builder().question(q4).optionText("It bypasses the need for environment variables in staging").isCorrect(false).build();
            q4.setOptions(List.of(o4_1, o4_2, o4_3, o4_4));

            test1.setQuestions(List.of(q1, q2, q3, q4));
            assessmentRepository.save(test1);

            // Assessment 2: DSA Problem Solving
            Assessment test2 = Assessment.builder()
                    .title("DSA & Algorithmic Problem Solving Benchmark")
                    .description("Evaluates graph algorithms, topological sorting, dynamic programming patterns, and amortized complexity.")
                    .domainId(1L)
                    .domainName("Core Computer Science")
                    .difficulty("ADVANCED")
                    .durationMinutes(20)
                    .totalMarks(30)
                    .passingPercentage(BigDecimal.valueOf(70.0))
                    .isActive(true)
                    .build();

            Question q2_1 = Question.builder()
                    .assessment(test2)
                    .questionText("Which algorithmic strategy is optimal for detecting cycles in a directed graph within O(V + E) time?")
                    .subSkill("Graph Theory")
                    .difficulty("MEDIUM")
                    .points(10)
                    .explanation("DFS with 3-color state tracking (Unvisited, Visiting, Visited) detects back-edges in linear time.")
                    .build();

            QuestionOption d1_1 = QuestionOption.builder().question(q2_1).optionText("Depth-First Search (DFS) with 3-color state tracking (White, Gray, Black)").isCorrect(true).build();
            QuestionOption d1_2 = QuestionOption.builder().question(q2_1).optionText("Dijkstra's shortest path algorithm").isCorrect(false).build();
            QuestionOption d1_3 = QuestionOption.builder().question(q2_1).optionText("Prim's Minimum Spanning Tree").isCorrect(false).build();
            QuestionOption d1_4 = QuestionOption.builder().question(q2_1).optionText("Binary search on graph vertex set").isCorrect(false).build();
            q2_1.setOptions(List.of(d1_1, d1_2, d1_3, d1_4));

            test2.setQuestions(List.of(q2_1));
            assessmentRepository.save(test2);
        }

        // 3. Seed Attempts history if absent
        if (attemptRepository.count() == 0) {
            AssessmentAttempt sampleAttempt = AssessmentAttempt.builder()
                    .userId(1L)
                    .assessmentId(1L)
                    .assessmentTitle("Full-Stack Java & Cloud Readiness Sprint")
                    .scoreObtained(BigDecimal.valueOf(30.0))
                    .totalPossible(BigDecimal.valueOf(40.0))
                    .percentage(BigDecimal.valueOf(75.0))
                    .campusPercentile(BigDecimal.valueOf(82.4))
                    .timeTakenSeconds(540)
                    .status("EVALUATED")
                    .createdAt(LocalDateTime.now().minusDays(2))
                    .build();
            attemptRepository.save(sampleAttempt);
        }

        log.info("SkillArena AI database initialization completed successfully.");
    }
}

