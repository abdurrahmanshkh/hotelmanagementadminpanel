package com.smartstay.controller;

import com.smartstay.dto.booking.BookingDto;
import com.smartstay.dto.common.ApiResponse;
import com.smartstay.dto.common.PageData;
import com.smartstay.enums.BookingStatus;
import com.smartstay.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminBookingController {

    private final BookingService bookingService;

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<PageData<BookingDto>>> getBookings(
            @RequestParam(required = false) String reference,
            @RequestParam(required = false) String guestQuery,
            @RequestParam(required = false) String roomNumber,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) String checkInFrom,
            @RequestParam(required = false) String checkInTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy
    ) {
        PageData<BookingDto> pageData = bookingService.searchBookings(
                reference, guestQuery, roomNumber, status, checkInFrom, checkInTo, page, size, sortBy
        );
        return ResponseEntity.ok(ApiResponse.ok("Bookings retrieved successfully", pageData));
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<ApiResponse<BookingDto>> getBookingById(@PathVariable Long id) {
        BookingDto booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.ok("Booking details retrieved", booking));
    }

    @PatchMapping("/bookings/{id}/check-in")
    public ResponseEntity<ApiResponse<BookingDto>> checkIn(@PathVariable Long id) {
        BookingDto updated = bookingService.checkInGuest(id);
        return ResponseEntity.ok(ApiResponse.ok("Guest checked-in successfully", updated));
    }

    @PatchMapping("/bookings/{id}/check-out")
    public ResponseEntity<ApiResponse<BookingDto>> checkOut(@PathVariable Long id) {
        BookingDto updated = bookingService.checkOutGuest(id);
        return ResponseEntity.ok(ApiResponse.ok("Guest checked-out successfully", updated));
    }

    @PostMapping("/bookings/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingDto>> cancelBooking(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body
    ) {
        String reason = body != null ? body.get("reason") : "Cancelled by admin";
        BookingDto cancelled = bookingService.cancelBooking(id, null, reason);
        return ResponseEntity.ok(ApiResponse.ok("Booking cancelled successfully", cancelled));
    }
}
