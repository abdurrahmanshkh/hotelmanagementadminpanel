package com.smartstay.dto.maintenance;

import lombok.Data;

@Data
public class CompleteMaintenanceRequestDto {
    private String resolutionNotes;
    private boolean cleaningRequired;
    private boolean roomReady;
}
