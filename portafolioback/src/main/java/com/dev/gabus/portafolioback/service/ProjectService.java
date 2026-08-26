package com.dev.gabus.portafolioback.service;

import com.dev.gabus.portafolioback.model.dto.CreateProjectRequest;
import com.dev.gabus.portafolioback.model.dto.ProjectResponse;
import com.dev.gabus.portafolioback.model.enums.ProjectType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProjectService {

    Page<ProjectResponse> listAll(Pageable pageable);

    Page<ProjectResponse> listByType(ProjectType type, Pageable pageable);

    Page<ProjectResponse> listFeatured(Pageable pageable);

    Page<ProjectResponse> search(String query, Pageable pageable);

    Page<ProjectResponse> listByTechnology(Long technologyId, Pageable pageable);

    ProjectResponse getBySlug(String slug);

    ProjectResponse getById(Long id);

    ProjectResponse create(CreateProjectRequest request);

    ProjectResponse update(Long id, CreateProjectRequest request);

    void delete(Long id);

    void incrementViews(Long id);
}
