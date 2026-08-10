package com.smartstay.controller;

import com.smartstay.dto.booking.*;
import com.smartstay.dto.common.ApiResponse;
import com.smartstay.model.User;
import com.smartstay.service.AuthService;
import com.smartstay.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final AuthService authService;

    @PostMapping("/bookings/quote")
    public ResponseEntity<ApiResponse<BookingQuoteDto>> getQuote(@Valid @RequestBody BookingQuoteRequestDto request) {
        BookingQuoteDto quote = bookingService.generateQuote(request);
        return ResponseEntity.ok(ApiResponse.ok("Booking quote generated", quote));
    }

    @PostMapping("/bookings")
    public ResponseEntity<ApiResponse<BookingDto>> createBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateBookingRequestDto request
    ) {
        User user = authService.getAuthenticatedUser(userDetails.getUsername());
        BookingDto booking = bookingService.createBooking(user, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Booking created successfully", booking));
    }

    @GetMapping("/customer/bookings")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getMyBookings(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getAuthenticatedUser(userDetails.getUsername());
        List<BookingDto> bookings = bookingService.getCustomerBookings(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Customer bookings retrieved", bookings));
    }

    @GetMapping("/customer/bookings/{id}")
    public ResponseEntity<ApiResponse<BookingDto>> getBookingDetails(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        BookingDto booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.ok("Booking details retrieved", booking));
    }

    @PostMapping("/customer/bookings/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingDto>> cancelMyBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body
    ) {
        User user = authService.getAuthenticatedUser(userDetails.getUsername());
        String reason = body != null ? body.get("reason") : "Cancelled by guest";
        BookingDto cancelled = bookingService.cancelBooking(id, user.getId(), reason);
        return ResponseEntity.ok(ApiResponse.ok("Booking cancelled successfully", cancelled));
    }
}
