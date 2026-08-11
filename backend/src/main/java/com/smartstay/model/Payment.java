package com.smartstay.model;

import com.smartstay.enums.PaymentMethod;
import com.smartstay.enums.PaymentStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "payment_reference", nullable = false, unique = true)
    private String paymentReference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "method", nullable = false)
    private PaymentMethod method;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "refunded_amount", precision = 12, scale = 2)
    private BigDecimal refundedAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PaymentStatus status;

    @Column(name = "gateway_name")
    private String gatewayName = "SmartStay Dummy Gateway";

    @Column(name = "gateway_transaction_reference")
    private String gatewayTransactionReference;

    @Column(name = "failure_reason")
    private String failureReason;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Payment() {
    }

    public Payment(Long id, String paymentReference, Booking booking, User user, PaymentMethod method, BigDecimal amount, BigDecimal refundedAmount, PaymentStatus status, String gatewayName, String gatewayTransactionReference, String failureReason, LocalDateTime paidAt, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.paymentReference = paymentReference;
        this.booking = booking;
        this.user = user;
        this.method = method;
        this.amount = amount;
        this.refundedAmount = refundedAmount != null ? refundedAmount : BigDecimal.ZERO;
        this.status = status;
        this.gatewayName = gatewayName != null ? gatewayName : "SmartStay Dummy Gateway";
        this.gatewayTransactionReference = gatewayTransactionReference;
        this.failureReason = failureReason;
        this.paidAt = paidAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.refundedAmount == null) this.refundedAmount = BigDecimal.ZERO;
        if (this.gatewayName == null) this.gatewayName = "SmartStay Dummy Gateway";
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPaymentReference() { return paymentReference; }
    public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public PaymentMethod getMethod() { return method; }
    public void setMethod(PaymentMethod method) { this.method = method; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getRefundedAmount() { return refundedAmount; }
    public void setRefundedAmount(BigDecimal refundedAmount) { this.refundedAmount = refundedAmount; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public String getGatewayName() { return gatewayName; }
    public void setGatewayName(String gatewayName) { this.gatewayName = gatewayName; }

    public String getGatewayTransactionReference() { return gatewayTransactionReference; }
    public void setGatewayTransactionReference(String gatewayTransactionReference) { this.gatewayTransactionReference = gatewayTransactionReference; }

    public String getFailureReason() { return failureReason; }
    public void setFailureReason(String failureReason) { this.failureReason = failureReason; }

    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static PaymentBuilder builder() {
        return new PaymentBuilder();
    }

    public static class PaymentBuilder {
        private Long id;
        private String paymentReference;
        private Booking booking;
        private User user;
        private PaymentMethod method;
        private BigDecimal amount;
        private BigDecimal refundedAmount = BigDecimal.ZERO;
        private PaymentStatus status;
        private String gatewayName = "SmartStay Dummy Gateway";
        private String gatewayTransactionReference;
        private String failureReason;
        private LocalDateTime paidAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public PaymentBuilder id(Long id) { this.id = id; return this; }
        public PaymentBuilder paymentReference(String paymentReference) { this.paymentReference = paymentReference; return this; }
        public PaymentBuilder booking(Booking booking) { this.booking = booking; return this; }
        public PaymentBuilder user(User user) { this.user = user; return this; }
        public PaymentBuilder method(PaymentMethod method) { this.method = method; return this; }
        public PaymentBuilder amount(BigDecimal amount) { this.amount = amount; return this; }
        public PaymentBuilder refundedAmount(BigDecimal refundedAmount) { this.refundedAmount = refundedAmount; return this; }
        public PaymentBuilder status(PaymentStatus status) { this.status = status; return this; }
        public PaymentBuilder gatewayName(String gatewayName) { this.gatewayName = gatewayName; return this; }
        public PaymentBuilder gatewayTransactionReference(String gatewayTransactionReference) { this.gatewayTransactionReference = gatewayTransactionReference; return this; }
        public PaymentBuilder failureReason(String failureReason) { this.failureReason = failureReason; return this; }
        public PaymentBuilder paidAt(LocalDateTime paidAt) { this.paidAt = paidAt; return this; }
        public PaymentBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public PaymentBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Payment build() {
            return new Payment(id, paymentReference, booking, user, method, amount, refundedAmount, status, gatewayName, gatewayTransactionReference, failureReason, paidAt, createdAt, updatedAt);
        }
    }
}
