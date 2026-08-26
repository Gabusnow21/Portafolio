package com.dev.gabus.portafolioback.controller;

import com.dev.gabus.portafolioback.model.dto.MetricsResponse;
import com.dev.gabus.portafolioback.service.MetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/metrics")
@RequiredArgsConstructor
public class MetricsController {

    private final MetricsService metricsService;

    @GetMapping
    public ResponseEntity<MetricsResponse> getMetrics() {
        return ResponseEntity.ok(metricsService.getMetrics());
    }
}
