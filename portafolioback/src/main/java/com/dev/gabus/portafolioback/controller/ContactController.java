package com.dev.gabus.portafolioback.controller;

import com.dev.gabus.portafolioback.model.dto.ContactMessageRequest;
import com.dev.gabus.portafolioback.model.dto.ContactMessageResponse;
import com.dev.gabus.portafolioback.service.ContactService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<ContactMessageResponse> create(
            @Valid @RequestBody ContactMessageRequest request,
            HttpServletRequest httpRequest) {
        String ip = httpRequest.getRemoteAddr();
        String ua = httpRequest.getHeader("User-Agent");
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(contactService.create(request, ip, ua));
    }

    @GetMapping
    public ResponseEntity<Page<ContactMessageResponse>> listAll(Pageable pageable) {
        return ResponseEntity.ok(contactService.listAll(pageable));
    }

    @GetMapping("/unread")
    public ResponseEntity<Page<ContactMessageResponse>> listUnread(Pageable pageable) {
        return ResponseEntity.ok(contactService.listUnread(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactMessageResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(contactService.getById(id));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        contactService.markAsRead(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/archive")
    public ResponseEntity<Void> archive(@PathVariable Long id) {
        contactService.archive(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        contactService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Long> countUnread() {
        return ResponseEntity.ok(contactService.countUnread());
    }
}
