package com.smartstay.controller;

import com.smartstay.dto.common.ApiResponse;
import com.smartstay.dto.feedback.FeedbackDto;
import com.smartstay.dto.feedback.SubmitFeedbackRequestDto;
import com.smartstay.model.User;
import com.smartstay.service.AuthService;
import com.smartstay.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final AuthService authService;

    public FeedbackController(FeedbackService feedbackService, AuthService authService) {
        this.feedbackService = feedbackService;
        this.authService = authService;
    }

    @PostMapping("/customer/feedback")
    public ResponseEntity<ApiResponse<FeedbackDto>> submitFeedback(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SubmitFeedbackRequestDto request
    ) {
        User user = authService.getAuthenticatedUser(userDetails.getUsername());
        FeedbackDto created = feedbackService.submitFeedback(user, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Feedback submitted successfully", created));
    }

    @GetMapping("/customer/feedback")
    public ResponseEntity<ApiResponse<List<FeedbackDto>>> getMyFeedback(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getAuthenticatedUser(userDetails.getUsername());
        List<FeedbackDto> feedbackList = feedbackService.getCustomerFeedback(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Feedback retrieved", feedbackList));
    }

    @GetMapping("/admin/feedback")
    public ResponseEntity<ApiResponse<List<FeedbackDto>>> getAllFeedback() {
        List<FeedbackDto> feedbackList = feedbackService.getAllFeedback();
        return ResponseEntity.ok(ApiResponse.ok("All feedback records retrieved", feedbackList));
    }

    @PatchMapping("/admin/feedback/{id}/visibility")
    public ResponseEntity<ApiResponse<FeedbackDto>> toggleVisibility(
            @PathVariable Long id,
            @RequestParam boolean visible
    ) {
        FeedbackDto updated = feedbackService.toggleVisibility(id, visible);
        return ResponseEntity.ok(ApiResponse.ok("Feedback visibility updated", updated));
    }
}
