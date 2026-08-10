package com.smartstay.repository;

import com.smartstay.enums.MaintenanceStatus;
import com.smartstay.enums.Priority;
import com.smartstay.model.MaintenanceRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MaintenanceRecordRepository extends JpaRepository<MaintenanceRecord, Long> {

    List<MaintenanceRecord> findByStatus(MaintenanceStatus status);

    @Query("SELECT m FROM MaintenanceRecord m WHERE " +
           "(:query IS NULL OR LOWER(m.recordNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(m.title) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:roomNumber IS NULL OR m.room.roomNumber = :roomNumber) AND " +
           "(:priority IS NULL OR m.priority = :priority) AND " +
           "(:status IS NULL OR m.status = :status)")
    Page<MaintenanceRecord> searchMaintenanceRecords(
            @Param("query") String query,
            @Param("roomNumber") String roomNumber,
            @Param("priority") Priority priority,
            @Param("status") MaintenanceStatus status,
            Pageable pageable
    );
}
