package com.dev.gabus.portafolioback.service;

import com.dev.gabus.portafolioback.model.dto.MetricsResponse;
import com.dev.gabus.portafolioback.model.enums.ProjectStatus;
import com.dev.gabus.portafolioback.model.enums.ProjectType;
import com.dev.gabus.portafolioback.repository.ContactMessageRepository;
import com.dev.gabus.portafolioback.repository.ProjectRepository;
import com.dev.gabus.portafolioback.repository.TechnologyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MetricsService {

    private final ProjectRepository projectRepository;
    private final TechnologyRepository technologyRepository;
    private final ContactMessageRepository contactMessageRepository;

    public MetricsResponse getMetrics() {
        long total = projectRepository.count();
        long web = projectRepository.countByType(ProjectType.WEB);
        long mobile = projectRepository.countByType(ProjectType.MOBILE);
        long techs = technologyRepository.count();
        long unread = contactMessageRepository.countUnread();

        Map<String, Long> byStatus = java.util.Arrays.stream(ProjectStatus.values())
            .collect(Collectors.toMap(
                ProjectStatus::name,
                status -> projectRepository.findAll().stream()
                    .filter(p -> p.getStatus() == status)
                    .count()
            ));

        return new MetricsResponse(total, web, mobile, techs, unread, byStatus);
    }
}
