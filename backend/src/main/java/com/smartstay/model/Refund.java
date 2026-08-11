package com.smartstay.model;

import com.smartstay.enums.RefundStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "refunds")
public class Refund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "refund_reference", nullable = false, unique = true)
    private String refundReference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "reason")
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RefundStatus status = RefundStatus.SUCCESS;

    @Column(name = "processed_by")
    private String processedBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Refund() {
    }

    public Refund(Long id, String refundReference, Payment payment, Booking booking, BigDecimal amount, String reason, RefundStatus status, String processedBy, LocalDateTime createdAt) {
        this.id = id;
        this.refundReference = refundReference;
        this.payment = payment;
        this.booking = booking;
        this.amount = amount;
        this.reason = reason;
        this.status = status != null ? status : RefundStatus.SUCCESS;
        this.processedBy = processedBy;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = RefundStatus.SUCCESS;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRefundReference() { return refundReference; }
    public void setRefundReference(String refundReference) { this.refundReference = refundReference; }

    public Payment getPayment() { return payment; }
    public void setPayment(Payment payment) { this.payment = payment; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public RefundStatus getStatus() { return status; }
    public void setStatus(RefundStatus status) { this.status = status; }

    public String getProcessedBy() { return processedBy; }
    public void setProcessedBy(String processedBy) { this.processedBy = processedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static RefundBuilder builder() {
        return new RefundBuilder();
    }

    public static class RefundBuilder {
        private Long id;
        private String refundReference;
        private Payment payment;
        private Booking booking;
        private BigDecimal amount;
        private String reason;
        private RefundStatus status = RefundStatus.SUCCESS;
        private String processedBy;
        private LocalDateTime createdAt;

        public RefundBuilder id(Long id) { this.id = id; return this; }
        public RefundBuilder refundReference(String refundReference) { this.refundReference = refundReference; return this; }
        public RefundBuilder payment(Payment payment) { this.payment = payment; return this; }
        public RefundBuilder booking(Booking booking) { this.booking = booking; return this; }
        public RefundBuilder amount(BigDecimal amount) { this.amount = amount; return this; }
        public RefundBuilder reason(String reason) { this.reason = reason; return this; }
        public RefundBuilder status(RefundStatus status) { this.status = status; return this; }
        public RefundBuilder processedBy(String processedBy) { this.processedBy = processedBy; return this; }
        public RefundBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Refund build() {
            return new Refund(id, refundReference, payment, booking, amount, reason, status, processedBy, createdAt);
        }
    }
}
