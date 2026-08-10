package com.smartstay.dto.payment;

import com.smartstay.enums.PaymentMethod;
import com.smartstay.enums.PaymentStatus;
import com.smartstay.model.Payment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDto {

    private Long id;
    private String paymentReference;
    private Long bookingId;
    private String bookingReference;
    private Long userId;
    private String guestName;
    private BigDecimal amount;
    private BigDecimal refundedAmount;
    private String currency;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private String gatewayName;
    private String gatewayTransactionId;
    private String failureReason;
    private String paidAt;
    private String createdAt;
    private String updatedAt;

    public static PaymentDto fromEntity(Payment payment) {
        if (payment == null) return null;

        String gName = payment.getUser() != null ? payment.getUser().getFullName() : "Guest";
        String bRef = payment.getBooking() != null ? payment.getBooking().getBookingReference() : "";

        return PaymentDto.builder()
                .id(payment.getId())
                .paymentReference(payment.getPaymentReference())
                .bookingId(payment.getBooking() != null ? payment.getBooking().getId() : null)
                .bookingReference(bRef)
                .userId(payment.getUser() != null ? payment.getUser().getId() : null)
                .guestName(gName)
                .amount(payment.getAmount())
                .refundedAmount(payment.getRefundedAmount() != null ? payment.getRefundedAmount() : BigDecimal.ZERO)
                .currency("INR")
                .paymentMethod(payment.getMethod())
                .status(payment.getStatus())
                .gatewayName(payment.getGatewayName())
                .gatewayTransactionId(payment.getGatewayTransactionReference())
                .failureReason(payment.getFailureReason())
                .paidAt(payment.getPaidAt() != null ? payment.getPaidAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .createdAt(payment.getCreatedAt() != null ? payment.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .updatedAt(payment.getUpdatedAt() != null ? payment.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .build();
    }
}
