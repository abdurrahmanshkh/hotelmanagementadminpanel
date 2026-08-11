package com.smartstay.dto.maintenance;

import com.smartstay.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateMaintenanceRequestDto {

    @NotNull(message = "Room ID is required")
    private Long roomId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private Priority priority = Priority.MEDIUM;
    private Long assignedTechnicianId;

    public CreateMaintenanceRequestDto() {
    }

    public CreateMaintenanceRequestDto(Long roomId, String title, String description, Priority priority, Long assignedTechnicianId) {
        this.roomId = roomId;
        this.title = title;
        this.description = description;
        this.priority = priority != null ? priority : Priority.MEDIUM;
        this.assignedTechnicianId = assignedTechnicianId;
    }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public Long getAssignedTechnicianId() { return assignedTechnicianId; }
    public void setAssignedTechnicianId(Long assignedTechnicianId) { this.assignedTechnicianId = assignedTechnicianId; }
}
