package com.smartstay.repository;

import com.smartstay.enums.ChatStatus;
import com.smartstay.model.ChatThread;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatThreadRepository extends JpaRepository<ChatThread, Long> {

    List<ChatThread> findByUserIdOrderByLastMessageAtDesc(Long userId);

    List<ChatThread> findByStatus(ChatStatus status);

    long countByStatus(ChatStatus status);

    @Query("SELECT c FROM ChatThread c WHERE " +
           "(:query IS NULL OR LOWER(c.threadReference) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.user.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.user.lastName) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:assignedToMe IS NULL OR (:assignedToMe = true AND c.assignedAdmin.id = :adminId)) AND " +
           "(:unreadOnly IS NULL OR (:unreadOnly = true AND c.unreadCountAdmin > 0))")
    Page<ChatThread> searchThreads(
            @Param("query") String query,
            @Param("status") ChatStatus status,
            @Param("assignedToMe") Boolean assignedToMe,
            @Param("unreadOnly") Boolean unreadOnly,
            @Param("adminId") Long adminId,
            Pageable pageable
    );
}
