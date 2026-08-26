package com.dev.gabus.portafolioback.service.impl;

import com.dev.gabus.portafolioback.exception.ResourceNotFoundException;
import com.dev.gabus.portafolioback.model.dto.TechnologyRequest;
import com.dev.gabus.portafolioback.model.dto.TechnologyResponse;
import com.dev.gabus.portafolioback.model.entity.Technology;
import com.dev.gabus.portafolioback.repository.TechnologyRepository;
import com.dev.gabus.portafolioback.service.TechnologyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TechnologyServiceImpl implements TechnologyService {

    private final TechnologyRepository technologyRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TechnologyResponse> listAll() {
        return technologyRepository.findAll().stream()
            .map(this::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TechnologyResponse> listByCategory(String category) {
        return technologyRepository.findByCategoryIgnoreCase(category).stream()
            .map(this::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TechnologyResponse getById(Long id) {
        Technology tech = technologyRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Technology", "id", id));
        return toResponse(tech);
    }

    @Override
    public TechnologyResponse create(TechnologyRequest request) {
        if (technologyRepository.existsByNameIgnoreCase(request.name())) {
            throw new IllegalArgumentException("Ya existe una tecnología con el nombre: " + request.name());
        }

        Technology tech = Technology.builder()
            .name(request.name())
            .category(request.category())
            .icon(request.icon())
            .color(request.color() != null ? request.color() : "#888888")
            .build();

        return toResponse(technologyRepository.save(tech));
    }

    @Override
    public TechnologyResponse update(Long id, TechnologyRequest request) {
        Technology tech = technologyRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Technology", "id", id));

        tech.setName(request.name());
        tech.setCategory(request.category());
        tech.setIcon(request.icon());
        tech.setColor(request.color() != null ? request.color() : tech.getColor());

        return toResponse(technologyRepository.save(tech));
    }

    @Override
    public void delete(Long id) {
        if (!technologyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Technology", "id", id);
        }
        technologyRepository.deleteById(id);
    }

    private TechnologyResponse toResponse(Technology tech) {
        return new TechnologyResponse(
            tech.getId(),
            tech.getName(),
            tech.getCategory(),
            tech.getIcon(),
            tech.getColor(),
            tech.getCreatedAt()
        );
    }
}
