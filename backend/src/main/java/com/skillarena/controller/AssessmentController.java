package com.skillarena.controller;

import com.skillarena.dto.AssessmentDTO;
import com.skillarena.model.Assessment;
import com.skillarena.model.AssessmentAttempt;
import com.skillarena.service.AssessmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AssessmentController {

    private final AssessmentService assessmentService;

    @GetMapping
    public ResponseEntity<List<Assessment>> getAllAssessments() {
        return ResponseEntity.ok(assessmentService.getAllActiveAssessments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Assessment> getAssessment(@PathVariable Long id) {
        return ResponseEntity.ok(assessmentService.getAssessmentById(id));
    }

    @PostMapping("/submit")
    public ResponseEntity<AssessmentDTO.ResultResponse> submitAssessment(
            @RequestBody AssessmentDTO.SubmissionRequest request) {
        return ResponseEntity.ok(assessmentService.submitAssessment(request));
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<AssessmentAttempt>> getUserHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(assessmentService.getUserAttemptHistory(userId));
    }
}

