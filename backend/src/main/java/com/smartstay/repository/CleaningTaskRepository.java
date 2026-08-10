package com.smartstay.repository;

import com.smartstay.enums.CleaningTaskStatus;
import com.smartstay.model.CleaningTask;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CleaningTaskRepository extends JpaRepository<CleaningTask, Long> {

    List<CleaningTask> findByStatus(CleaningTaskStatus status);

    @Query("SELECT c FROM CleaningTask c WHERE " +
           "(:roomNumber IS NULL OR c.room.roomNumber = :roomNumber) AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:assignedStaffId IS NULL OR c.assignedStaff.id = :assignedStaffId)")
    Page<CleaningTask> searchCleaningTasks(
            @Param("roomNumber") String roomNumber,
            @Param("status") CleaningTaskStatus status,
            @Param("assignedStaffId") Long assignedStaffId,
            Pageable pageable
    );
}
