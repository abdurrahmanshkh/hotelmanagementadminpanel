package com.smartstay.service;

import com.smartstay.dto.common.PageData;
import com.smartstay.dto.payment.*;
import com.smartstay.enums.BookingStatus;
import com.smartstay.enums.PaymentMethod;
import com.smartstay.enums.PaymentStatus;
import com.smartstay.enums.RefundStatus;
import com.smartstay.enums.RoomStatus;
import com.smartstay.exception.BusinessRuleException;
import com.smartstay.exception.ResourceNotFoundException;
import com.smartstay.model.*;
import com.smartstay.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final RefundRepository refundRepository;
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final PasscodeService passcodeService;
    private final NotificationService notificationService;

    public PaymentService(
            PaymentRepository paymentRepository,
            RefundRepository refundRepository,
            BookingRepository bookingRepository,
            RoomRepository roomRepository,
            PasscodeService passcodeService,
            NotificationService notificationService
    ) {
        this.paymentRepository = paymentRepository;
        this.refundRepository = refundRepository;
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.passcodeService = passcodeService;
        this.notificationService = notificationService;
    }

    @Transactional
    public PaymentDto processPayment(User user, ProcessPaymentRequestDto req) {
        Booking booking = bookingRepository.findById(req.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + req.getBookingId()));

        if (booking.getStatus() != BookingStatus.PENDING_PAYMENT && booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new BusinessRuleException("Payment cannot be processed for booking status: " + booking.getStatus());
        }

        String dummyToken = req.getDummyPaymentToken() != null ? req.getDummyPaymentToken() : req.getPaymentToken();
        boolean isSuccess = dummyToken == null || dummyToken.contains("success") || dummyToken.startsWith("tok_");
        if (dummyToken != null && (dummyToken.contains("failure") || dummyToken.contains("fail"))) {
            isSuccess = false;
        }

        String payRef = "PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String txnRef = "TXN_" + System.currentTimeMillis();

        PaymentStatus pStatus = isSuccess ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;

        Payment payment = Payment.builder()
                .paymentReference(payRef)
                .booking(booking)
                .user(user)
                .method(req.getPaymentMethod() != null ? req.getPaymentMethod() : PaymentMethod.CARD)
                .amount(booking.getTotalAmount())
                .refundedAmount(BigDecimal.ZERO)
                .status(pStatus)
                .gatewayName("SmartStay Payment Gateway")
                .gatewayTransactionReference(txnRef)
                .failureReason(isSuccess ? null : "Simulated payment failure (tok_failure)")
                .paidAt(isSuccess ? LocalDateTime.now() : null)
                .build();

        payment = paymentRepository.save(payment);

        if (isSuccess) {
            booking.setStatus(BookingStatus.CONFIRMED);
            booking.getRoom().setStatus(RoomStatus.RESERVED);
            roomRepository.save(booking.getRoom());
            bookingRepository.save(booking);

            // Generate passcode securely
            passcodeService.generatePasscodeForBooking(booking);

            // Trigger notification
            notificationService.createNotification(
                    user,
                    "BOOKING_CONFIRMED",
                    "Booking Confirmed!",
                    "Your booking " + booking.getBookingReference() + " for room " + booking.getRoom().getRoomNumber() + " is confirmed."
            );
        }

        return PaymentDto.fromEntity(payment);
    }

    @Transactional(readOnly = true)
    public PaymentDto getPaymentById(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + paymentId));
        return PaymentDto.fromEntity(payment);
    }

    @Transactional(readOnly = true)
    public PaymentDto getPaymentByBookingId(Long bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found for booking ID: " + bookingId));
        return PaymentDto.fromEntity(payment);
    }

    @Transactional(readOnly = true)
    public PageData<PaymentDto> searchPayments(
            String query, PaymentMethod method, PaymentStatus status,
            String fromDate, String toDate, int page, int size
    ) {
        LocalDateTime from = fromDate != null && !fromDate.isBlank() ? LocalDate.parse(fromDate).atStartOfDay() : null;
        LocalDateTime to = toDate != null && !toDate.isBlank() ? LocalDate.parse(toDate).atTime(23, 59, 59) : null;

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Payment> paymentPage = paymentRepository.searchPayments(query, method, status, from, to, pageable);

        List<PaymentDto> dtos = paymentPage.getContent().stream()
                .map(PaymentDto::fromEntity)
                .collect(Collectors.toList());

        return PageData.of(dtos, paymentPage.getNumber(), paymentPage.getSize(), paymentPage.getTotalElements());
    }

    @Transactional
    public RefundRecordDto processRefund(Long paymentId, RefundRequestDto req) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + paymentId));

        if (payment.getStatus() != PaymentStatus.SUCCESS && payment.getStatus() != PaymentStatus.PARTIALLY_REFUNDED) {
            throw new BusinessRuleException("Cannot process refund for non-successful payment");
        }

        BigDecimal refundAmt = req.getAmount();
        BigDecimal currentRefunded = payment.getRefundedAmount() != null ? payment.getRefundedAmount() : BigDecimal.ZERO;
        BigDecimal maxRefundable = payment.getAmount().subtract(currentRefunded);

        if (refundAmt.compareTo(maxRefundable) > 0) {
            throw new BusinessRuleException("Refund amount exceeds maximum refundable amount of ₹" + maxRefundable);
        }

        BigDecimal newRefundedTotal = currentRefunded.add(refundAmt);
        payment.setRefundedAmount(newRefundedTotal);

        if (newRefundedTotal.compareTo(payment.getAmount()) >= 0) {
            payment.setStatus(PaymentStatus.REFUNDED);
        } else {
            payment.setStatus(PaymentStatus.PARTIALLY_REFUNDED);
        }

        paymentRepository.save(payment);

        String refCode = "RFD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Refund refund = Refund.builder()
                .refundReference(refCode)
                .payment(payment)
                .booking(payment.getBooking())
                .amount(refundAmt)
                .reason(req.getReason() != null ? req.getReason() : "Refund requested")
                .status(RefundStatus.SUCCESS)
                .processedBy("System Manager")
                .build();

        refund = refundRepository.save(refund);
        return RefundRecordDto.fromEntity(refund);
    }

    @Transactional(readOnly = true)
    public List<RefundRecordDto> getRefundsByPaymentId(Long paymentId) {
        return refundRepository.findByPaymentId(paymentId).stream()
                .map(RefundRecordDto::fromEntity)
                .collect(Collectors.toList());
    }
}
