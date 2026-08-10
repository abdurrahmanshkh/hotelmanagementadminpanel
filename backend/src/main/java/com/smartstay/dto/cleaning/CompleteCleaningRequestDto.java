package com.smartstay.dto.cleaning;

import com.smartstay.enums.Priority;
import lombok.Data;

@Data
public class CompleteCleaningRequestDto {
    private String notes;
    private boolean roomInspected;
    private boolean roomReady;
    private boolean maintenanceIssueFound;
    private String maintenanceDescription;
    private Priority priority;
}
