package com.smartstay.dto.payment;

import com.smartstay.enums.PaymentMethod;
import com.smartstay.enums.PaymentStatus;
import com.smartstay.model.Payment;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

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

    public PaymentDto() {
    }

    public PaymentDto(Long id, String paymentReference, Long bookingId, String bookingReference, Long userId, String guestName, BigDecimal amount, BigDecimal refundedAmount, String currency, PaymentMethod paymentMethod, PaymentStatus status, String gatewayName, String gatewayTransactionId, String failureReason, String paidAt, String createdAt, String updatedAt) {
        this.id = id;
        this.paymentReference = paymentReference;
        this.bookingId = bookingId;
        this.bookingReference = bookingReference;
        this.userId = userId;
        this.guestName = guestName;
        this.amount = amount;
        this.refundedAmount = refundedAmount;
        this.currency = currency;
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.gatewayName = gatewayName;
        this.gatewayTransactionId = gatewayTransactionId;
        this.failureReason = failureReason;
        this.paidAt = paidAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPaymentReference() { return paymentReference; }
    public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getGuestName() { return guestName; }
    public void setGuestName(String guestName) { this.guestName = guestName; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getRefundedAmount() { return refundedAmount; }
    public void setRefundedAmount(BigDecimal refundedAmount) { this.refundedAmount = refundedAmount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public String getGatewayName() { return gatewayName; }
    public void setGatewayName(String gatewayName) { this.gatewayName = gatewayName; }

    public String getGatewayTransactionId() { return gatewayTransactionId; }
    public void setGatewayTransactionId(String gatewayTransactionId) { this.gatewayTransactionId = gatewayTransactionId; }

    public String getFailureReason() { return failureReason; }
    public void setFailureReason(String failureReason) { this.failureReason = failureReason; }

    public String getPaidAt() { return paidAt; }
    public void setPaidAt(String paidAt) { this.paidAt = paidAt; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

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

    public static PaymentDtoBuilder builder() {
        return new PaymentDtoBuilder();
    }

    public static class PaymentDtoBuilder {
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

        public PaymentDtoBuilder id(Long id) { this.id = id; return this; }
        public PaymentDtoBuilder paymentReference(String paymentReference) { this.paymentReference = paymentReference; return this; }
        public PaymentDtoBuilder bookingId(Long bookingId) { this.bookingId = bookingId; return this; }
        public PaymentDtoBuilder bookingReference(String bookingReference) { this.bookingReference = bookingReference; return this; }
        public PaymentDtoBuilder userId(Long userId) { this.userId = userId; return this; }
        public PaymentDtoBuilder guestName(String guestName) { this.guestName = guestName; return this; }
        public PaymentDtoBuilder amount(BigDecimal amount) { this.amount = amount; return this; }
        public PaymentDtoBuilder refundedAmount(BigDecimal refundedAmount) { this.refundedAmount = refundedAmount; return this; }
        public PaymentDtoBuilder currency(String currency) { this.currency = currency; return this; }
        public PaymentDtoBuilder paymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; return this; }
        public PaymentDtoBuilder status(PaymentStatus status) { this.status = status; return this; }
        public PaymentDtoBuilder gatewayName(String gatewayName) { this.gatewayName = gatewayName; return this; }
        public PaymentDtoBuilder gatewayTransactionId(String gatewayTransactionId) { this.gatewayTransactionId = gatewayTransactionId; return this; }
        public PaymentDtoBuilder failureReason(String failureReason) { this.failureReason = failureReason; return this; }
        public PaymentDtoBuilder paidAt(String paidAt) { this.paidAt = paidAt; return this; }
        public PaymentDtoBuilder createdAt(String createdAt) { this.createdAt = createdAt; return this; }
        public PaymentDtoBuilder updatedAt(String updatedAt) { this.updatedAt = updatedAt; return this; }

        public PaymentDto build() {
            return new PaymentDto(id, paymentReference, bookingId, bookingReference, userId, guestName, amount, refundedAmount, currency, paymentMethod, status, gatewayName, gatewayTransactionId, failureReason, paidAt, createdAt, updatedAt);
        }
    }
}
