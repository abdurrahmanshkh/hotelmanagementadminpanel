package com.smartstay.repository;

import com.smartstay.enums.Priority;
import com.smartstay.enums.ServiceRequestStatus;
import com.smartstay.model.ServiceRequestEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequestEntity, Long> {

    List<ServiceRequestEntity> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<ServiceRequestEntity> findByStatus(ServiceRequestStatus status);

    long countByStatus(ServiceRequestStatus status);

    @Query("SELECT s FROM ServiceRequestEntity s WHERE " +
           "(:query IS NULL OR LOWER(s.requestReference) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.user.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.user.lastName) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:category IS NULL OR LOWER(s.category) = LOWER(:category)) AND " +
           "(:priority IS NULL OR s.priority = :priority) AND " +
           "(:status IS NULL OR s.status = :status) AND " +
           "(:roomNumber IS NULL OR s.room.roomNumber = :roomNumber) AND " +
           "(:unassignedOnly IS NULL OR (:unassignedOnly = true AND s.assignedTo IS NULL))")
    Page<ServiceRequestEntity> searchRequests(
            @Param("query") String query,
            @Param("category") String category,
            @Param("priority") Priority priority,
            @Param("status") ServiceRequestStatus status,
            @Param("roomNumber") String roomNumber,
            @Param("unassignedOnly") Boolean unassignedOnly,
            Pageable pageable
    );
}
