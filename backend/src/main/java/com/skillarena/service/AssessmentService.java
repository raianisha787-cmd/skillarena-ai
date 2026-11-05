package com.skillarena.service;

import com.skillarena.dto.AssessmentDTO;
import com.skillarena.model.*;
import com.skillarena.repository.AssessmentAttemptRepository;
import com.skillarena.repository.AssessmentRepository;
import com.skillarena.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final AssessmentAttemptRepository attemptRepository;
    private final UserRepository userRepository;

    public List<Assessment> getAllActiveAssessments() {
        return assessmentRepository.findByIsActiveTrue();
    }

    public Assessment getAssessmentById(Long id) {
        return assessmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assessment not found with id: " + id));
    }

    public AssessmentDTO.ResultResponse submitAssessment(AssessmentDTO.SubmissionRequest request) {
        Assessment assessment = getAssessmentById(request.getAssessmentId());
        Map<Long, Long> userAnswers = request.getAnswers() != null ? request.getAnswers() : Map.of();

        int correctCount = 0;
        int totalQuestions = assessment.getQuestions().size();
        int totalPossibleMarks = assessment.getTotalMarks();
        int marksPerQuestion = totalQuestions > 0 ? (totalPossibleMarks / totalQuestions) : 10;
        int scoreObtained = 0;

        for (Question q : assessment.getQuestions()) {
            Long selectedOptionId = userAnswers.get(q.getId());
            if (selectedOptionId != null) {
                boolean isCorrect = q.getOptions().stream()
                        .anyMatch(opt -> opt.getId().equals(selectedOptionId) && Boolean.TRUE.equals(opt.getIsCorrect()));
                if (isCorrect) {
                    correctCount++;
                    scoreObtained += (q.getPoints() != null ? q.getPoints() : marksPerQuestion);
                }
            }
        }

        BigDecimal percentage = BigDecimal.valueOf(scoreObtained)
                .multiply(BigDecimal.valueOf(100.0))
                .divide(BigDecimal.valueOf(totalPossibleMarks), 2, RoundingMode.HALF_UP);

        boolean passed = percentage.compareTo(assessment.getPassingPercentage()) >= 0;

        // Simulated Gaussian percentile calculation based on performance
        BigDecimal campusPercentile = percentage.multiply(BigDecimal.valueOf(0.92))
                .setScale(1, RoundingMode.HALF_UP);
        if (campusPercentile.compareTo(BigDecimal.valueOf(99.0)) > 0) {
            campusPercentile = BigDecimal.valueOf(99.0);
        }

        AssessmentAttempt attempt = AssessmentAttempt.builder()
                .userId(request.getUserId())
                .assessmentId(assessment.getId())
                .assessmentTitle(assessment.getTitle())
                .scoreObtained(BigDecimal.valueOf(scoreObtained))
                .totalPossible(BigDecimal.valueOf(totalPossibleMarks))
                .percentage(percentage)
                .campusPercentile(campusPercentile)
                .timeTakenSeconds(request.getTimeTakenSeconds() != null ? request.getTimeTakenSeconds() : 600)
                .status("EVALUATED")
                .build();

        attempt = attemptRepository.save(attempt);

        // Update student's overall readiness score in User profile
        userRepository.findById(request.getUserId()).ifPresent(user -> {
            BigDecimal updatedScore = user.getCurrentReadinessScore()
                    .multiply(BigDecimal.valueOf(0.6))
                    .add(percentage.multiply(BigDecimal.valueOf(0.4)))
                    .setScale(2, RoundingMode.HALF_UP);
            user.setCurrentReadinessScore(updatedScore);
            userRepository.save(user);
        });

        String feedback = passed 
                ? "Excellent performance! You met the campus placement benchmark threshold."
                : "Good attempt! Review the AI-generated remedial roadmap to reinforce weak areas.";

        return AssessmentDTO.ResultResponse.builder()
                .attemptId(attempt.getId())
                .assessmentId(assessment.getId())
                .assessmentTitle(assessment.getTitle())
                .scoreObtained(BigDecimal.valueOf(scoreObtained))
                .totalPossible(BigDecimal.valueOf(totalPossibleMarks))
                .percentage(percentage)
                .campusPercentile(campusPercentile)
                .passed(passed)
                .correctAnswersCount(correctCount)
                .totalQuestionsCount(totalQuestions)
                .feedback(feedback)
                .build();
    }

    public List<AssessmentAttempt> getUserAttemptHistory(Long userId) {
        return attemptRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}

