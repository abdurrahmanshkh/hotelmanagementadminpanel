package com.smartstay.dto.maintenance;

import com.smartstay.enums.MaintenanceStatus;
import com.smartstay.enums.Priority;
import com.smartstay.model.MaintenanceRecord;

import java.time.format.DateTimeFormatter;

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

    public MaintenanceRecordDto() {
    }

    public MaintenanceRecordDto(Long id, String recordNumber, Long roomId, String roomNumber, String roomTypeName, String title, String description, Priority priority, MaintenanceStatus status, String reportedBy, Long assignedTechnicianId, String assignedTechnicianName, String resolutionNotes, boolean cleaningRequiredOnCompletion, String createdAt, String assignedAt, String startedAt, String onHoldAt, String completedAt) {
        this.id = id;
        this.recordNumber = recordNumber;
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.roomTypeName = roomTypeName;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.reportedBy = reportedBy;
        this.assignedTechnicianId = assignedTechnicianId;
        this.assignedTechnicianName = assignedTechnicianName;
        this.resolutionNotes = resolutionNotes;
        this.cleaningRequiredOnCompletion = cleaningRequiredOnCompletion;
        this.createdAt = createdAt;
        this.assignedAt = assignedAt;
        this.startedAt = startedAt;
        this.onHoldAt = onHoldAt;
        this.completedAt = completedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRecordNumber() { return recordNumber; }
    public void setRecordNumber(String recordNumber) { this.recordNumber = recordNumber; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getRoomTypeName() { return roomTypeName; }
    public void setRoomTypeName(String roomTypeName) { this.roomTypeName = roomTypeName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public MaintenanceStatus getStatus() { return status; }
    public void setStatus(MaintenanceStatus status) { this.status = status; }

    public String getReportedBy() { return reportedBy; }
    public void setReportedBy(String reportedBy) { this.reportedBy = reportedBy; }

    public Long getAssignedTechnicianId() { return assignedTechnicianId; }
    public void setAssignedTechnicianId(Long assignedTechnicianId) { this.assignedTechnicianId = assignedTechnicianId; }

    public String getAssignedTechnicianName() { return assignedTechnicianName; }
    public void setAssignedTechnicianName(String assignedTechnicianName) { this.assignedTechnicianName = assignedTechnicianName; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }

    public boolean isCleaningRequiredOnCompletion() { return cleaningRequiredOnCompletion; }
    public void setCleaningRequiredOnCompletion(boolean cleaningRequiredOnCompletion) { this.cleaningRequiredOnCompletion = cleaningRequiredOnCompletion; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getAssignedAt() { return assignedAt; }
    public void setAssignedAt(String assignedAt) { this.assignedAt = assignedAt; }

    public String getStartedAt() { return startedAt; }
    public void setStartedAt(String startedAt) { this.startedAt = startedAt; }

    public String getOnHoldAt() { return onHoldAt; }
    public void setOnHoldAt(String onHoldAt) { this.onHoldAt = onHoldAt; }

    public String getCompletedAt() { return completedAt; }
    public void setCompletedAt(String completedAt) { this.completedAt = completedAt; }

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

    public static MaintenanceRecordDtoBuilder builder() {
        return new MaintenanceRecordDtoBuilder();
    }

    public static class MaintenanceRecordDtoBuilder {
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

        public MaintenanceRecordDtoBuilder id(Long id) { this.id = id; return this; }
        public MaintenanceRecordDtoBuilder recordNumber(String recordNumber) { this.recordNumber = recordNumber; return this; }
        public MaintenanceRecordDtoBuilder roomId(Long roomId) { this.roomId = roomId; return this; }
        public MaintenanceRecordDtoBuilder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public MaintenanceRecordDtoBuilder roomTypeName(String roomTypeName) { this.roomTypeName = roomTypeName; return this; }
        public MaintenanceRecordDtoBuilder title(String title) { this.title = title; return this; }
        public MaintenanceRecordDtoBuilder description(String description) { this.description = description; return this; }
        public MaintenanceRecordDtoBuilder priority(Priority priority) { this.priority = priority; return this; }
        public MaintenanceRecordDtoBuilder status(MaintenanceStatus status) { this.status = status; return this; }
        public MaintenanceRecordDtoBuilder reportedBy(String reportedBy) { this.reportedBy = reportedBy; return this; }
        public MaintenanceRecordDtoBuilder assignedTechnicianId(Long assignedTechnicianId) { this.assignedTechnicianId = assignedTechnicianId; return this; }
        public MaintenanceRecordDtoBuilder assignedTechnicianName(String assignedTechnicianName) { this.assignedTechnicianName = assignedTechnicianName; return this; }
        public MaintenanceRecordDtoBuilder resolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; return this; }
        public MaintenanceRecordDtoBuilder cleaningRequiredOnCompletion(boolean cleaningRequiredOnCompletion) { this.cleaningRequiredOnCompletion = cleaningRequiredOnCompletion; return this; }
        public MaintenanceRecordDtoBuilder createdAt(String createdAt) { this.createdAt = createdAt; return this; }
        public MaintenanceRecordDtoBuilder assignedAt(String assignedAt) { this.assignedAt = assignedAt; return this; }
        public MaintenanceRecordDtoBuilder startedAt(String startedAt) { this.startedAt = startedAt; return this; }
        public MaintenanceRecordDtoBuilder onHoldAt(String onHoldAt) { this.onHoldAt = onHoldAt; return this; }
        public MaintenanceRecordDtoBuilder completedAt(String completedAt) { this.completedAt = completedAt; return this; }

        public MaintenanceRecordDto build() {
            return new MaintenanceRecordDto(id, recordNumber, roomId, roomNumber, roomTypeName, title, description, priority, status, reportedBy, assignedTechnicianId, assignedTechnicianName, resolutionNotes, cleaningRequiredOnCompletion, createdAt, assignedAt, startedAt, onHoldAt, completedAt);
        }
    }
}
