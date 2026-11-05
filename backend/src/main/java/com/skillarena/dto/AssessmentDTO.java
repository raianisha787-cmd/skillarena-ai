package com.skillarena.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class AssessmentDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubmissionRequest {
        private Long userId;
        private Long assessmentId;
        private Integer timeTakenSeconds;
        // Map of questionId -> selectedOptionId
        private Map<Long, Long> answers;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResultResponse {
        private Long attemptId;
        private Long assessmentId;
        private String assessmentTitle;
        private BigDecimal scoreObtained;
        private BigDecimal totalPossible;
        private BigDecimal percentage;
        private BigDecimal campusPercentile;
        private Boolean passed;
        private Integer correctAnswersCount;
        private Integer totalQuestionsCount;
        private String feedback;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuestionDetail {
        private Long id;
        private String questionText;
        private String codeSnippet;
        private String subSkill;
        private String difficulty;
        private Integer points;
        private List<OptionDetail> options;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OptionDetail {
        private Long id;
        private String optionText;
    }
}

