package com.skillarena.controller;

import com.skillarena.dto.AnalyticsDTO;
import com.skillarena.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/campus-summary")
    public ResponseEntity<AnalyticsDTO.CampusSummary> getCampusSummary() {
        return ResponseEntity.ok(analyticsService.getCampusSummary());
    }
}

