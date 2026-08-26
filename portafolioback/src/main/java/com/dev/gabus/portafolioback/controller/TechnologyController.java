package com.dev.gabus.portafolioback.controller;

import com.dev.gabus.portafolioback.model.dto.TechnologyRequest;
import com.dev.gabus.portafolioback.model.dto.TechnologyResponse;
import com.dev.gabus.portafolioback.service.TechnologyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/technologies")
@RequiredArgsConstructor
public class TechnologyController {

    private final TechnologyService technologyService;

    @GetMapping
    public ResponseEntity<List<TechnologyResponse>> listAll() {
        return ResponseEntity.ok(technologyService.listAll());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<TechnologyResponse>> listByCategory(@PathVariable String category) {
        return ResponseEntity.ok(technologyService.listByCategory(category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TechnologyResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(technologyService.getById(id));
    }

    @PostMapping
    public ResponseEntity<TechnologyResponse> create(@Valid @RequestBody TechnologyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(technologyService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TechnologyResponse> update(
            @PathVariable Long id, @Valid @RequestBody TechnologyRequest request) {
        return ResponseEntity.ok(technologyService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        technologyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
