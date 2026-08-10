package com.smartstay.controller;

import com.smartstay.dto.auth.UpdateProfileRequestDto;
import com.smartstay.dto.auth.UserResponseDto;
import com.smartstay.dto.common.ApiResponse;
import com.smartstay.model.User;
import com.smartstay.service.AuthService;
import com.smartstay.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/customer")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;
    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponseDto>> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getAuthenticatedUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Profile retrieved", UserResponseDto.fromEntity(user)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponseDto>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateProfileRequestDto request
    ) {
        User user = authService.getAuthenticatedUser(userDetails.getUsername());
        UserResponseDto updated = userService.updateProfile(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }
}
