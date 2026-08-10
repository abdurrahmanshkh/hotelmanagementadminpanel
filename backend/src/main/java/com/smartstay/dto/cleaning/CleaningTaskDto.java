package com.smartstay.dto.cleaning;

import com.smartstay.enums.CleaningTaskStatus;
import com.smartstay.model.CleaningTask;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CleaningTaskDto {

    private Long id;
    private String taskNumber;
    private Long roomId;
    private String roomNumber;
    private String roomTypeName;
    private CleaningTaskStatus status;
    private Long assignedStaffId;
    private String assignedStaffName;
    private Long createdFromBookingId;
    private String notes;
    private boolean maintenanceIssueFound;
    private String createdAt;
    private String assignedAt;
    private String startedAt;
    private String completedAt;

    public static CleaningTaskDto fromEntity(CleaningTask task) {
        if (task == null) return null;

        String rNum = task.getRoom() != null ? task.getRoom().getRoomNumber() : "";
        String rTypeName = (task.getRoom() != null && task.getRoom().getRoomType() != null) ? task.getRoom().getRoomType().getName() : "";
        String staffName = task.getAssignedStaff() != null ? task.getAssignedStaff().getFullName() : null;

        return CleaningTaskDto.builder()
                .id(task.getId())
                .taskNumber(task.getTaskNumber())
                .roomId(task.getRoom() != null ? task.getRoom().getId() : null)
                .roomNumber(rNum)
                .roomTypeName(rTypeName)
                .status(task.getStatus())
                .assignedStaffId(task.getAssignedStaff() != null ? task.getAssignedStaff().getId() : null)
                .assignedStaffName(staffName)
                .createdFromBookingId(task.getCreatedFromBooking() != null ? task.getCreatedFromBooking().getId() : null)
                .notes(task.getNotes())
                .maintenanceIssueFound(Boolean.TRUE.equals(task.getMaintenanceIssueFound()))
                .createdAt(task.getCreatedAt() != null ? task.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .assignedAt(task.getAssignedAt() != null ? task.getAssignedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .startedAt(task.getStartedAt() != null ? task.getStartedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .completedAt(task.getCompletedAt() != null ? task.getCompletedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .build();
    }
}
