package com.smartstay.controller;

import com.smartstay.dto.common.ApiResponse;
import com.smartstay.dto.common.PageData;
import com.smartstay.dto.service.CreateServiceRequestDto;
import com.smartstay.dto.service.ServiceRequestDto;
import com.smartstay.enums.Priority;
import com.smartstay.enums.ServiceRequestStatus;
import com.smartstay.model.User;
import com.smartstay.service.AuthService;
import com.smartstay.service.ServiceRequestManager;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/v1")
public class ServiceRequestController {

    private final ServiceRequestManager serviceRequestManager;
    private final AuthService authService;

    public ServiceRequestController(ServiceRequestManager serviceRequestManager, AuthService authService) {
        this.serviceRequestManager = serviceRequestManager;
        this.authService = authService;
    }

    @PostMapping("/customer/service-requests")
    public ResponseEntity<ApiResponse<ServiceRequestDto>> createCustomerRequest(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateServiceRequestDto request
    ) {
        User user = authService.getAuthenticatedUser(userDetails.getUsername());
        ServiceRequestDto created = serviceRequestManager.createRequest(user, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Service request created successfully", created));
    }

    @GetMapping("/customer/service-requests")
    public ResponseEntity<ApiResponse<List<ServiceRequestDto>>> getMyRequests(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getAuthenticatedUser(userDetails.getUsername());
        List<ServiceRequestDto> list = serviceRequestManager.getCustomerRequests(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Service requests retrieved", list));
    }

    @PostMapping("/customer/service-requests/{id}/cancel")
    public ResponseEntity<ApiResponse<ServiceRequestDto>> cancelMyRequest(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        User user = authService.getAuthenticatedUser(userDetails.getUsername());
        ServiceRequestDto cancelled = serviceRequestManager.cancelRequest(id, user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Service request cancelled", cancelled));
    }

    @GetMapping("/admin/service-requests")
    public ResponseEntity<ApiResponse<PageData<ServiceRequestDto>>> searchRequests(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) ServiceRequestStatus status,
            @RequestParam(required = false) String roomNumber,
            @RequestParam(required = false) Boolean unassignedOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageData<ServiceRequestDto> pageData = serviceRequestManager.searchRequests(
                query, category, priority, status, roomNumber, unassignedOnly, page, size
        );
        return ResponseEntity.ok(ApiResponse.ok("Service requests retrieved successfully", pageData));
    }

    @PatchMapping("/admin/service-requests/{id}/assign")
    public ResponseEntity<ApiResponse<ServiceRequestDto>> assignStaff(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body
    ) {
        Long staffId = body.get("staffId") != null ? Long.parseLong(body.get("staffId").toString()) : null;
        String staffName = body.get("staffName") != null ? body.get("staffName").toString() : null;
        ServiceRequestDto updated = serviceRequestManager.assignStaff(id, staffId, staffName);
        return ResponseEntity.ok(ApiResponse.ok("Staff assigned to service request", updated));
    }

    @PatchMapping("/admin/service-requests/{id}/status")
    public ResponseEntity<ApiResponse<ServiceRequestDto>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String statusStr = body.get("status");
        String notes = body.get("notes");
        ServiceRequestStatus status = ServiceRequestStatus.valueOf(statusStr.toUpperCase());
        ServiceRequestDto updated = serviceRequestManager.updateStatus(id, status, notes);
        return ResponseEntity.ok(ApiResponse.ok("Service request status updated", updated));
    }
}
