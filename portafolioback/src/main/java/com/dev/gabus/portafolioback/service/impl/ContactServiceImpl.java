package com.dev.gabus.portafolioback.service.impl;

import com.dev.gabus.portafolioback.exception.ResourceNotFoundException;
import com.dev.gabus.portafolioback.model.dto.ContactMessageRequest;
import com.dev.gabus.portafolioback.model.dto.ContactMessageResponse;
import com.dev.gabus.portafolioback.model.entity.ContactMessage;
import com.dev.gabus.portafolioback.repository.ContactMessageRepository;
import com.dev.gabus.portafolioback.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ContactServiceImpl implements ContactService {

    private final ContactMessageRepository contactMessageRepository;

    @Override
    public ContactMessageResponse create(ContactMessageRequest request, String ipAddress, String userAgent) {
        ContactMessage message = ContactMessage.builder()
            .name(request.name())
            .email(request.email())
            .subject(request.subject())
            .message(request.message())
            .ipAddress(ipAddress)
            .userAgent(userAgent)
            .build();

        return toResponse(contactMessageRepository.save(message));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ContactMessageResponse> listAll(Pageable pageable) {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc(pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ContactMessageResponse> listUnread(Pageable pageable) {
        return contactMessageRepository.findByIsReadFalseOrderByCreatedAtDesc(pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ContactMessageResponse getById(Long id) {
        ContactMessage message = contactMessageRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("ContactMessage", "id", id));
        return toResponse(message);
    }

    @Override
    public void markAsRead(Long id) {
        ContactMessage message = contactMessageRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("ContactMessage", "id", id));
        message.setIsRead(true);
        contactMessageRepository.save(message);
    }

    @Override
    public void archive(Long id) {
        ContactMessage message = contactMessageRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("ContactMessage", "id", id));
        message.setArchived(true);
        contactMessageRepository.save(message);
    }

    @Override
    public void delete(Long id) {
        if (!contactMessageRepository.existsById(id)) {
            throw new ResourceNotFoundException("ContactMessage", "id", id);
        }
        contactMessageRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public long countUnread() {
        return contactMessageRepository.countUnread();
    }

    private ContactMessageResponse toResponse(ContactMessage msg) {
        return new ContactMessageResponse(
            msg.getId(),
            msg.getName(),
            msg.getEmail(),
            msg.getSubject(),
            msg.getMessage(),
            msg.getIsRead(),
            msg.getArchived(),
            msg.getCreatedAt()
        );
    }
}
