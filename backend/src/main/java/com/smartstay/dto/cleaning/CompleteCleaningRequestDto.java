package com.smartstay.dto.cleaning;

import com.smartstay.enums.Priority;

public class CompleteCleaningRequestDto {
    private String notes;
    private boolean roomInspected;
    private boolean roomReady;
    private boolean maintenanceIssueFound;
    private String maintenanceDescription;
    private Priority priority;

    public CompleteCleaningRequestDto() {
    }

    public CompleteCleaningRequestDto(String notes, boolean roomInspected, boolean roomReady, boolean maintenanceIssueFound, String maintenanceDescription, Priority priority) {
        this.notes = notes;
        this.roomInspected = roomInspected;
        this.roomReady = roomReady;
        this.maintenanceIssueFound = maintenanceIssueFound;
        this.maintenanceDescription = maintenanceDescription;
        this.priority = priority;
    }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public boolean isRoomInspected() { return roomInspected; }
    public void setRoomInspected(boolean roomInspected) { this.roomInspected = roomInspected; }

    public boolean isRoomReady() { return roomReady; }
    public void setRoomReady(boolean roomReady) { this.roomReady = roomReady; }

    public boolean isMaintenanceIssueFound() { return maintenanceIssueFound; }
    public void setMaintenanceIssueFound(boolean maintenanceIssueFound) { this.maintenanceIssueFound = maintenanceIssueFound; }

    public String getMaintenanceDescription() { return maintenanceDescription; }
    public void setMaintenanceDescription(String maintenanceDescription) { this.maintenanceDescription = maintenanceDescription; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
}
