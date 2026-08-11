package com.smartstay.dto.maintenance;

public class CompleteMaintenanceRequestDto {
    private String resolutionNotes;
    private boolean cleaningRequired;
    private boolean roomReady;

    public CompleteMaintenanceRequestDto() {
    }

    public CompleteMaintenanceRequestDto(String resolutionNotes, boolean cleaningRequired, boolean roomReady) {
        this.resolutionNotes = resolutionNotes;
        this.cleaningRequired = cleaningRequired;
        this.roomReady = roomReady;
    }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }

    public boolean isCleaningRequired() { return cleaningRequired; }
    public void setCleaningRequired(boolean cleaningRequired) { this.cleaningRequired = cleaningRequired; }

    public boolean isRoomReady() { return roomReady; }
    public void setRoomReady(boolean roomReady) { this.roomReady = roomReady; }
}
