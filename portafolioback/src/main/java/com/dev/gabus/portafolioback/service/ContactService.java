package com.dev.gabus.portafolioback.service;

import com.dev.gabus.portafolioback.model.dto.ContactMessageRequest;
import com.dev.gabus.portafolioback.model.dto.ContactMessageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ContactService {

    ContactMessageResponse create(ContactMessageRequest request, String ipAddress, String userAgent);

    Page<ContactMessageResponse> listAll(Pageable pageable);

    Page<ContactMessageResponse> listUnread(Pageable pageable);

    ContactMessageResponse getById(Long id);

    void markAsRead(Long id);

    void archive(Long id);

    void delete(Long id);

    long countUnread();
}
