package com.smartstay.dto.maintenance;

import com.smartstay.enums.MaintenanceStatus;
import com.smartstay.enums.Priority;
import com.smartstay.model.MaintenanceRecord;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceRecordDto {

    private Long id;
    private String recordNumber;
    private Long roomId;
    private String roomNumber;
    private String roomTypeName;
    private String title;
    private String description;
    private Priority priority;
    private MaintenanceStatus status;
    private String reportedBy;
    private Long assignedTechnicianId;
    private String assignedTechnicianName;
    private String resolutionNotes;
    private boolean cleaningRequiredOnCompletion;
    private String createdAt;
    private String assignedAt;
    private String startedAt;
    private String onHoldAt;
    private String completedAt;

    public static MaintenanceRecordDto fromEntity(MaintenanceRecord m) {
        if (m == null) return null;

        String rNum = m.getRoom() != null ? m.getRoom().getRoomNumber() : "";
        String rTypeName = (m.getRoom() != null && m.getRoom().getRoomType() != null) ? m.getRoom().getRoomType().getName() : "";
        String techName = m.getAssignedTechnician() != null ? m.getAssignedTechnician().getFullName() : null;

        return MaintenanceRecordDto.builder()
                .id(m.getId())
                .recordNumber(m.getRecordNumber())
                .roomId(m.getRoom() != null ? m.getRoom().getId() : null)
                .roomNumber(rNum)
                .roomTypeName(rTypeName)
                .title(m.getTitle())
                .description(m.getDescription())
                .priority(m.getPriority())
                .status(m.getStatus())
                .reportedBy(m.getReportedBy() != null ? m.getReportedBy() : "Staff")
                .assignedTechnicianId(m.getAssignedTechnician() != null ? m.getAssignedTechnician().getId() : null)
                .assignedTechnicianName(techName)
                .resolutionNotes(m.getResolutionNotes())
                .cleaningRequiredOnCompletion(Boolean.TRUE.equals(m.getCleaningRequiredOnCompletion()))
                .createdAt(m.getCreatedAt() != null ? m.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .assignedAt(m.getAssignedAt() != null ? m.getAssignedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .startedAt(m.getStartedAt() != null ? m.getStartedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .onHoldAt(m.getOnHoldAt() != null ? m.getOnHoldAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .completedAt(m.getCompletedAt() != null ? m.getCompletedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .build();
    }
}
