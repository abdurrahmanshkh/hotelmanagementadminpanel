package com.smartstay.dto.cleaning;

import com.smartstay.enums.CleaningTaskStatus;
import com.smartstay.model.CleaningTask;

import java.time.format.DateTimeFormatter;

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

    public CleaningTaskDto() {
    }

    public CleaningTaskDto(Long id, String taskNumber, Long roomId, String roomNumber, String roomTypeName, CleaningTaskStatus status, Long assignedStaffId, String assignedStaffName, Long createdFromBookingId, String notes, boolean maintenanceIssueFound, String createdAt, String assignedAt, String startedAt, String completedAt) {
        this.id = id;
        this.taskNumber = taskNumber;
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.roomTypeName = roomTypeName;
        this.status = status;
        this.assignedStaffId = assignedStaffId;
        this.assignedStaffName = assignedStaffName;
        this.createdFromBookingId = createdFromBookingId;
        this.notes = notes;
        this.maintenanceIssueFound = maintenanceIssueFound;
        this.createdAt = createdAt;
        this.assignedAt = assignedAt;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTaskNumber() { return taskNumber; }
    public void setTaskNumber(String taskNumber) { this.taskNumber = taskNumber; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getRoomTypeName() { return roomTypeName; }
    public void setRoomTypeName(String roomTypeName) { this.roomTypeName = roomTypeName; }

    public CleaningTaskStatus getStatus() { return status; }
    public void setStatus(CleaningTaskStatus status) { this.status = status; }

    public Long getAssignedStaffId() { return assignedStaffId; }
    public void setAssignedStaffId(Long assignedStaffId) { this.assignedStaffId = assignedStaffId; }

    public String getAssignedStaffName() { return assignedStaffName; }
    public void setAssignedStaffName(String assignedStaffName) { this.assignedStaffName = assignedStaffName; }

    public Long getCreatedFromBookingId() { return createdFromBookingId; }
    public void setCreatedFromBookingId(Long createdFromBookingId) { this.createdFromBookingId = createdFromBookingId; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public boolean isMaintenanceIssueFound() { return maintenanceIssueFound; }
    public void setMaintenanceIssueFound(boolean maintenanceIssueFound) { this.maintenanceIssueFound = maintenanceIssueFound; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getAssignedAt() { return assignedAt; }
    public void setAssignedAt(String assignedAt) { this.assignedAt = assignedAt; }

    public String getStartedAt() { return startedAt; }
    public void setStartedAt(String startedAt) { this.startedAt = startedAt; }

    public String getCompletedAt() { return completedAt; }
    public void setCompletedAt(String completedAt) { this.completedAt = completedAt; }

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

    public static CleaningTaskDtoBuilder builder() {
        return new CleaningTaskDtoBuilder();
    }

    public static class CleaningTaskDtoBuilder {
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

        public CleaningTaskDtoBuilder id(Long id) { this.id = id; return this; }
        public CleaningTaskDtoBuilder taskNumber(String taskNumber) { this.taskNumber = taskNumber; return this; }
        public CleaningTaskDtoBuilder roomId(Long roomId) { this.roomId = roomId; return this; }
        public CleaningTaskDtoBuilder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public CleaningTaskDtoBuilder roomTypeName(String roomTypeName) { this.roomTypeName = roomTypeName; return this; }
        public CleaningTaskDtoBuilder status(CleaningTaskStatus status) { this.status = status; return this; }
        public CleaningTaskDtoBuilder assignedStaffId(Long assignedStaffId) { this.assignedStaffId = assignedStaffId; return this; }
        public CleaningTaskDtoBuilder assignedStaffName(String assignedStaffName) { this.assignedStaffName = assignedStaffName; return this; }
        public CleaningTaskDtoBuilder createdFromBookingId(Long createdFromBookingId) { this.createdFromBookingId = createdFromBookingId; return this; }
        public CleaningTaskDtoBuilder notes(String notes) { this.notes = notes; return this; }
        public CleaningTaskDtoBuilder maintenanceIssueFound(boolean maintenanceIssueFound) { this.maintenanceIssueFound = maintenanceIssueFound; return this; }
        public CleaningTaskDtoBuilder createdAt(String createdAt) { this.createdAt = createdAt; return this; }
        public CleaningTaskDtoBuilder assignedAt(String assignedAt) { this.assignedAt = assignedAt; return this; }
        public CleaningTaskDtoBuilder startedAt(String startedAt) { this.startedAt = startedAt; return this; }
        public CleaningTaskDtoBuilder completedAt(String completedAt) { this.completedAt = completedAt; return this; }

        public CleaningTaskDto build() {
            return new CleaningTaskDto(id, taskNumber, roomId, roomNumber, roomTypeName, status, assignedStaffId, assignedStaffName, createdFromBookingId, notes, maintenanceIssueFound, createdAt, assignedAt, startedAt, completedAt);
        }
    }
}
