package com.skillarena.controller;

import com.skillarena.service.AIServiceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AIController {

    private final AIServiceClient aiServiceClient;

    @PostMapping("/diagnose")
    public ResponseEntity<Map<String, Object>> diagnoseSkills(@RequestBody(required = false) Map<String, Object> body) {
        Long userId = body != null && body.containsKey("userId") ? Long.valueOf(body.get("userId").toString()) : 1L;
        String targetRole = body != null && body.containsKey("targetRole") ? (String) body.get("targetRole") : "Full-Stack Software Engineer";
        Map<String, Double> scores = (body != null && body.containsKey("scores")) ? (Map<String, Double>) body.get("scores") : null;

        Map<String, Object> diagnosis = aiServiceClient.getSkillDiagnosis(userId, targetRole, scores);
        return ResponseEntity.ok(diagnosis);
    }

    @GetMapping("/my-roadmap")
    public ResponseEntity<Map<String, Object>> getMyRoadmap(
            @RequestParam(defaultValue = "1") Long userId,
            @RequestParam(defaultValue = "Full-Stack Software Engineer") String targetRole) {
        Map<String, Object> diagnosis = aiServiceClient.getSkillDiagnosis(userId, targetRole, null);
        return ResponseEntity.ok(diagnosis);
    }
}

