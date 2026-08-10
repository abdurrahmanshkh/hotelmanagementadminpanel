package com.smartstay.dto.maintenance;

import com.smartstay.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateMaintenanceRequestDto {

    @NotNull(message = "Room ID is required")
    private Long roomId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private Priority priority = Priority.MEDIUM;
    private Long assignedTechnicianId;
}
