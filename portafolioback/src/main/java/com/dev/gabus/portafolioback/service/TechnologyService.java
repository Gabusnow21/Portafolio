package com.dev.gabus.portafolioback.service;

import com.dev.gabus.portafolioback.model.dto.TechnologyRequest;
import com.dev.gabus.portafolioback.model.dto.TechnologyResponse;

import java.util.List;

public interface TechnologyService {

    List<TechnologyResponse> listAll();

    List<TechnologyResponse> listByCategory(String category);

    TechnologyResponse getById(Long id);

    TechnologyResponse create(TechnologyRequest request);

    TechnologyResponse update(Long id, TechnologyRequest request);

    void delete(Long id);
}
