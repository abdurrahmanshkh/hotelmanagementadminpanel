package com.smartstay.controller;

import com.smartstay.dto.auth.GuestDetailsDto;
import com.smartstay.dto.auth.GuestSummaryDto;
import com.smartstay.dto.booking.BookingDto;
import com.smartstay.dto.common.ApiResponse;
import com.smartstay.dto.common.PageData;
import com.smartstay.enums.Role;
import com.smartstay.exception.ResourceNotFoundException;
import com.smartstay.model.User;
import com.smartstay.repository.UserRepository;
import com.smartstay.service.BookingService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/v1/admin/guests")
public class AdminGuestController {

    private final UserRepository userRepository;
    private final BookingService bookingService;

    public AdminGuestController(UserRepository userRepository, BookingService bookingService) {
        this.userRepository = userRepository;
        this.bookingService = bookingService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageData<GuestSummaryDto>>> getGuests(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> userPage = userRepository.searchCustomers(query, pageable);

        List<GuestSummaryDto> dtos = userPage.getContent().stream()
                .map(user -> {
                    List<BookingDto> bookings = bookingService.getCustomerBookings(user.getId());
                    String currentRoom = bookings.stream()
                            .filter(b -> b.getStatus() != null && b.getStatus().toString().equals("CHECKED_IN"))
                            .map(BookingDto::getRoomNumber)
                            .findFirst().orElse(null);
                    String lastStay = bookings.isEmpty() ? null : bookings.get(0).getCheckInDate();
                    return GuestSummaryDto.fromUser(user, bookings.size(), currentRoom, lastStay);
                })
                .toList();

        return ResponseEntity.ok(ApiResponse.ok("Guests list retrieved", PageData.of(dtos, userPage.getNumber(), userPage.getSize(), userPage.getTotalElements())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GuestDetailsDto>> getGuestById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guest user not found with ID: " + id));

        List<BookingDto> history = bookingService.getCustomerBookings(user.getId());
        String currentRoom = history.stream()
                .filter(b -> b.getStatus() != null && b.getStatus().toString().equals("CHECKED_IN"))
                .map(BookingDto::getRoomNumber)
                .findFirst().orElse(null);
        String lastStay = history.isEmpty() ? null : history.get(0).getCheckInDate();

        GuestDetailsDto details = GuestDetailsDto.fromUser(user, history, currentRoom, lastStay);
        return ResponseEntity.ok(ApiResponse.ok("Guest details retrieved", details));
    }

    @GetMapping("/{id}/bookings")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getGuestBookings(@PathVariable Long id) {
        List<BookingDto> bookings = bookingService.getCustomerBookings(id);
        return ResponseEntity.ok(ApiResponse.ok("Guest bookings retrieved", bookings));
    }
}
