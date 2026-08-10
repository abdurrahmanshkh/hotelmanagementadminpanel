package com.smartstay.controller;

import com.smartstay.dto.cleaning.CleaningTaskDto;
import com.smartstay.dto.cleaning.CompleteCleaningRequestDto;
import com.smartstay.dto.common.ApiResponse;
import com.smartstay.dto.common.PageData;
import com.smartstay.enums.CleaningTaskStatus;
import com.smartstay.service.CleaningService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/cleaning-tasks")
@RequiredArgsConstructor
public class CleaningController {

    private final CleaningService cleaningService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageData<CleaningTaskDto>>> getCleaningTasks(
            @RequestParam(required = false) String roomNumber,
            @RequestParam(required = false) CleaningTaskStatus status,
            @RequestParam(required = false) Long assignedStaffId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageData<CleaningTaskDto> pageData = cleaningService.searchCleaningTasks(roomNumber, status, assignedStaffId, page, size);
        return ResponseEntity.ok(ApiResponse.ok("Cleaning tasks retrieved", pageData));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CleaningTaskDto>> createCleaningTask(@RequestBody Map<String, Object> body) {
        Long roomId = Long.parseLong(body.get("roomId").toString());
        String notes = body.get("notes") != null ? body.get("notes").toString() : null;
        CleaningTaskDto created = cleaningService.createCleaningTask(roomId, notes);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Cleaning task created", created));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<CleaningTaskDto>> assignStaff(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body
    ) {
        Long staffId = body.get("staffId") != null ? Long.parseLong(body.get("staffId").toString()) : null;
        String staffName = body.get("staffName") != null ? body.get("staffName").toString() : null;
        CleaningTaskDto updated = cleaningService.assignStaff(id, staffId, staffName);
        return ResponseEntity.ok(ApiResponse.ok("Staff assigned to cleaning task", updated));
    }

    @PatchMapping("/{id}/start")
    public ResponseEntity<ApiResponse<CleaningTaskDto>> startTask(@PathVariable Long id) {
        CleaningTaskDto updated = cleaningService.startTask(id);
        return ResponseEntity.ok(ApiResponse.ok("Cleaning task started", updated));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<CleaningTaskDto>> completeTask(
            @PathVariable Long id,
            @RequestBody(required = false) CompleteCleaningRequestDto request
    ) {
        CleaningTaskDto updated = cleaningService.completeTask(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Cleaning task completed successfully", updated));
    }
}
