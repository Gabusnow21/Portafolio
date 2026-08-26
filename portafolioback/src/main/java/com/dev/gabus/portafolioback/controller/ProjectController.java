package com.dev.gabus.portafolioback.controller;

import com.dev.gabus.portafolioback.model.dto.CreateProjectRequest;
import com.dev.gabus.portafolioback.model.dto.ProjectResponse;
import com.dev.gabus.portafolioback.model.enums.ProjectType;
import com.dev.gabus.portafolioback.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<Page<ProjectResponse>> listAll(Pageable pageable) {
        return ResponseEntity.ok(projectService.listAll(pageable));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<Page<ProjectResponse>> listByType(
            @PathVariable ProjectType type, Pageable pageable) {
        return ResponseEntity.ok(projectService.listByType(type, pageable));
    }

    @GetMapping("/featured")
    public ResponseEntity<Page<ProjectResponse>> listFeatured(Pageable pageable) {
        return ResponseEntity.ok(projectService.listFeatured(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProjectResponse>> search(
            @RequestParam String q, Pageable pageable) {
        return ResponseEntity.ok(projectService.search(q, pageable));
    }

    @GetMapping("/technology/{technologyId}")
    public ResponseEntity<Page<ProjectResponse>> listByTechnology(
            @PathVariable Long technologyId, Pageable pageable) {
        return ResponseEntity.ok(projectService.listByTechnology(technologyId, pageable));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ProjectResponse> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(projectService.getBySlug(slug));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> create(@Valid @RequestBody CreateProjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> update(
            @PathVariable Long id, @Valid @RequestBody CreateProjectRequest request) {
        return ResponseEntity.ok(projectService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/views")
    public ResponseEntity<Void> incrementViews(@PathVariable Long id) {
        projectService.incrementViews(id);
        return ResponseEntity.noContent().build();
    }
}
