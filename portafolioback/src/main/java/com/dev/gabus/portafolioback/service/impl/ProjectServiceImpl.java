package com.dev.gabus.portafolioback.service.impl;

import com.dev.gabus.portafolioback.exception.ResourceNotFoundException;
import com.dev.gabus.portafolioback.model.dto.CreateProjectRequest;
import com.dev.gabus.portafolioback.model.dto.ProjectResponse;
import com.dev.gabus.portafolioback.model.dto.TechnologyResponse;
import com.dev.gabus.portafolioback.model.entity.Project;
import com.dev.gabus.portafolioback.model.entity.Technology;
import com.dev.gabus.portafolioback.model.enums.ProjectType;
import com.dev.gabus.portafolioback.repository.ProjectRepository;
import com.dev.gabus.portafolioback.repository.TechnologyRepository;
import com.dev.gabus.portafolioback.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final TechnologyRepository technologyRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<ProjectResponse> listAll(Pageable pageable) {
        return projectRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProjectResponse> listByType(ProjectType type, Pageable pageable) {
        return projectRepository.findByType(type, pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProjectResponse> listFeatured(Pageable pageable) {
        return projectRepository.findByFeaturedTrue(pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProjectResponse> search(String query, Pageable pageable) {
        return projectRepository.searchByQuery(query, pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProjectResponse> listByTechnology(Long technologyId, Pageable pageable) {
        return projectRepository.findByTechnologyId(technologyId, pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getBySlug(String slug) {
        Project project = projectRepository.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Project", "slug", slug));
        return toResponse(project);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getById(Long id) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        return toResponse(project);
    }

    @Override
    public ProjectResponse create(CreateProjectRequest request) {
        Set<Technology> technologies = resolveTechnologies(request.technologyIds());

        Project project = Project.builder()
            .title(request.title())
            .shortDescription(request.shortDescription())
            .description(request.description())
            .type(request.type())
            .status(request.status())
            .repoUrl(request.repoUrl())
            .demoUrl(request.demoUrl())
            .imageUrl(request.imageUrl())
            .featured(request.featured())
            .startDate(request.startDate())
            .endDate(request.endDate())
            .technologies(technologies)
            .build();

        return toResponse(projectRepository.save(project));
    }

    @Override
    public ProjectResponse update(Long id, CreateProjectRequest request) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        Set<Technology> technologies = resolveTechnologies(request.technologyIds());

        project.setTitle(request.title());
        project.setShortDescription(request.shortDescription());
        project.setDescription(request.description());
        project.setType(request.type());
        project.setStatus(request.status() != null ? request.status() : project.getStatus());
        project.setRepoUrl(request.repoUrl());
        project.setDemoUrl(request.demoUrl());
        project.setImageUrl(request.imageUrl());
        project.setFeatured(request.featured() != null ? request.featured() : project.getFeatured());
        project.setStartDate(request.startDate());
        project.setEndDate(request.endDate());
        project.setTechnologies(technologies);

        return toResponse(projectRepository.save(project));
    }

    @Override
    public void delete(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project", "id", id);
        }
        projectRepository.deleteById(id);
    }

    @Override
    public void incrementViews(Long id) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        project.setViewsCount(project.getViewsCount() + 1);
        projectRepository.save(project);
    }

    private Set<Technology> resolveTechnologies(Set<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return new HashSet<>();
        }
        return new HashSet<>(technologyRepository.findAllById(ids));
    }

    private ProjectResponse toResponse(Project project) {
        Set<TechnologyResponse> techs = project.getTechnologies().stream()
            .map(t -> new TechnologyResponse(t.getId(), t.getName(), t.getCategory(),
                t.getIcon(), t.getColor(), t.getCreatedAt()))
            .collect(java.util.stream.Collectors.toSet());

        return new ProjectResponse(
            project.getId(),
            project.getTitle(),
            project.getSlug(),
            project.getShortDescription(),
            project.getDescription(),
            project.getType(),
            project.getStatus(),
            project.getRepoUrl(),
            project.getDemoUrl(),
            project.getImageUrl(),
            project.getFeatured(),
            project.getStartDate(),
            project.getEndDate(),
            project.getViewsCount(),
            techs,
            project.getCreatedAt(),
            project.getUpdatedAt()
        );
    }
}
