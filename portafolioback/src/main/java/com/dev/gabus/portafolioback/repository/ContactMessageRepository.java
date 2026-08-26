package com.dev.gabus.portafolioback.repository;

import com.dev.gabus.portafolioback.model.entity.ContactMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    Page<ContactMessage> findByIsReadFalseOrderByCreatedAtDesc(Pageable pageable);

    Page<ContactMessage> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT COUNT(c) FROM ContactMessage c WHERE c.isRead = false")
    long countUnread();
}
