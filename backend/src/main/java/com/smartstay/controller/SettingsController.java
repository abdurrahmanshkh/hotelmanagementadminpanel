package com.smartstay.controller;

import com.smartstay.dto.common.ApiResponse;
import com.smartstay.dto.settings.HotelSettingsDto;
import com.smartstay.dto.settings.UpdateHotelSettingsRequestDto;
import com.smartstay.model.User;
import com.smartstay.service.AuthService;
import com.smartstay.service.SettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<ApiResponse<HotelSettingsDto>> getSettings() {
        HotelSettingsDto settings = settingsService.getSettings();
        return ResponseEntity.ok(ApiResponse.ok("Hotel settings retrieved", settings));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<HotelSettingsDto>> updateSettings(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateHotelSettingsRequestDto request
    ) {
        User admin = authService.getAuthenticatedUser(userDetails.getUsername());
        HotelSettingsDto updated = settingsService.updateSettings(request, admin.getFullName());
        return ResponseEntity.ok(ApiResponse.ok("Hotel settings updated successfully", updated));
    }
}
