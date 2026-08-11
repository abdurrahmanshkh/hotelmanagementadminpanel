package com.smartstay.controller;

import com.smartstay.dto.common.ApiResponse;
import com.smartstay.dto.common.PageData;
import com.smartstay.dto.maintenance.*;
import com.smartstay.enums.MaintenanceStatus;
import com.smartstay.enums.Priority;
import com.smartstay.service.MaintenanceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/maintenance")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageData<MaintenanceRecordDto>>> getRecords(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String roomNumber,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) MaintenanceStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageData<MaintenanceRecordDto> pageData = maintenanceService.searchRecords(query, roomNumber, priority, status, page, size);
        return ResponseEntity.ok(ApiResponse.ok("Maintenance records retrieved", pageData));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MaintenanceRecordDto>> createRecord(@Valid @RequestBody CreateMaintenanceRequestDto request) {
        MaintenanceRecordDto created = maintenanceService.createRecord(request, "Admin Staff");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Maintenance record created", created));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<MaintenanceRecordDto>> assignTechnician(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body
    ) {
        Long techId = body.get("techId") != null ? Long.parseLong(body.get("techId").toString()) : (body.get("technicianId") != null ? Long.parseLong(body.get("technicianId").toString()) : null);
        String techName = body.get("techName") != null ? body.get("techName").toString() : null;
        MaintenanceRecordDto updated = maintenanceService.assignTechnician(id, techId, techName);
        return ResponseEntity.ok(ApiResponse.ok("Technician assigned to maintenance record", updated));
    }

    @PatchMapping("/{id}/start")
    public ResponseEntity<ApiResponse<MaintenanceRecordDto>> startRecord(@PathVariable Long id) {
        MaintenanceRecordDto updated = maintenanceService.startRecord(id);
        return ResponseEntity.ok(ApiResponse.ok("Maintenance work started", updated));
    }

    @PatchMapping("/{id}/hold")
    public ResponseEntity<ApiResponse<MaintenanceRecordDto>> holdRecord(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body
    ) {
        String reason = body != null ? body.get("reason") : "Waiting for spare parts";
        MaintenanceRecordDto updated = maintenanceService.holdRecord(id, reason);
        return ResponseEntity.ok(ApiResponse.ok("Maintenance put on hold", updated));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<MaintenanceRecordDto>> completeRecord(
            @PathVariable Long id,
            @RequestBody(required = false) CompleteMaintenanceRequestDto request
    ) {
        MaintenanceRecordDto updated = maintenanceService.completeRecord(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Maintenance completed successfully", updated));
    }
}
