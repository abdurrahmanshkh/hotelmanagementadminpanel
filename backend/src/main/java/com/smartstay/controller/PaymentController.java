package com.smartstay.controller;

import com.smartstay.dto.common.ApiResponse;
import com.smartstay.dto.common.PageData;
import com.smartstay.dto.payment.*;
import com.smartstay.enums.PaymentMethod;
import com.smartstay.enums.PaymentStatus;
import com.smartstay.model.User;
import com.smartstay.service.AuthService;
import com.smartstay.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class PaymentController {

    private final PaymentService paymentService;
    private final AuthService authService;

    public PaymentController(PaymentService paymentService, AuthService authService) {
        this.paymentService = paymentService;
        this.authService = authService;
    }

    @PostMapping("/payments/process")
    public ResponseEntity<ApiResponse<PaymentDto>> processPayment(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ProcessPaymentRequestDto request
    ) {
        User user = authService.getAuthenticatedUser(userDetails.getUsername());
        PaymentDto result = paymentService.processPayment(user, request);
        return ResponseEntity.ok(ApiResponse.ok("Payment processed successfully", result));
    }

    @GetMapping("/payments/booking/{bookingId}")
    public ResponseEntity<ApiResponse<PaymentDto>> getPaymentByBooking(@PathVariable Long bookingId) {
        PaymentDto payment = paymentService.getPaymentByBookingId(bookingId);
        return ResponseEntity.ok(ApiResponse.ok("Payment details retrieved", payment));
    }

    @GetMapping("/admin/payments")
    public ResponseEntity<ApiResponse<PageData<PaymentDto>>> searchPayments(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) PaymentMethod method,
            @RequestParam(required = false) PaymentStatus status,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageData<PaymentDto> pageData = paymentService.searchPayments(query, method, status, fromDate, toDate, page, size);
        return ResponseEntity.ok(ApiResponse.ok("Payments list retrieved", pageData));
    }

    @PostMapping("/admin/payments/{paymentId}/refund")
    public ResponseEntity<ApiResponse<RefundRecordDto>> processRefund(
            @PathVariable Long paymentId,
            @Valid @RequestBody RefundRequestDto request
    ) {
        RefundRecordDto refund = paymentService.processRefund(paymentId, request);
        return ResponseEntity.ok(ApiResponse.ok("Refund processed successfully", refund));
    }

    @GetMapping("/admin/payments/{paymentId}/refunds")
    public ResponseEntity<ApiResponse<List<RefundRecordDto>>> getRefunds(@PathVariable Long paymentId) {
        List<RefundRecordDto> refunds = paymentService.getRefundsByPaymentId(paymentId);
        return ResponseEntity.ok(ApiResponse.ok("Refund records retrieved", refunds));
    }
}
