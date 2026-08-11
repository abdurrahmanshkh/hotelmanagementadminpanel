package com.smartstay.dto.payment;

import com.smartstay.enums.RefundStatus;
import com.smartstay.model.Refund;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

public class RefundRecordDto {

    private Long id;
    private String refundReference;
    private Long paymentId;
    private BigDecimal amount;
    private String reason;
    private RefundStatus status;
    private String processedBy;
    private String createdAt;

    public RefundRecordDto() {
    }

    public RefundRecordDto(Long id, String refundReference, Long paymentId, BigDecimal amount, String reason, RefundStatus status, String processedBy, String createdAt) {
        this.id = id;
        this.refundReference = refundReference;
        this.paymentId = paymentId;
        this.amount = amount;
        this.reason = reason;
        this.status = status;
        this.processedBy = processedBy;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRefundReference() { return refundReference; }
    public void setRefundReference(String refundReference) { this.refundReference = refundReference; }

    public Long getPaymentId() { return paymentId; }
    public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public RefundStatus getStatus() { return status; }
    public void setStatus(RefundStatus status) { this.status = status; }

    public String getProcessedBy() { return processedBy; }
    public void setProcessedBy(String processedBy) { this.processedBy = processedBy; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public static RefundRecordDto fromEntity(Refund refund) {
        if (refund == null) return null;
        return RefundRecordDto.builder()
                .id(refund.getId())
                .refundReference(refund.getRefundReference())
                .paymentId(refund.getPayment() != null ? refund.getPayment().getId() : null)
                .amount(refund.getAmount())
                .reason(refund.getReason())
                .status(refund.getStatus())
                .processedBy(refund.getProcessedBy() != null ? refund.getProcessedBy() : "System Admin")
                .createdAt(refund.getCreatedAt() != null ? refund.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .build();
    }

    public static RefundRecordDtoBuilder builder() {
        return new RefundRecordDtoBuilder();
    }

    public static class RefundRecordDtoBuilder {
        private Long id;
        private String refundReference;
        private Long paymentId;
        private BigDecimal amount;
        private String reason;
        private RefundStatus status;
        private String processedBy;
        private String createdAt;

        public RefundRecordDtoBuilder id(Long id) { this.id = id; return this; }
        public RefundRecordDtoBuilder refundReference(String refundReference) { this.refundReference = refundReference; return this; }
        public RefundRecordDtoBuilder paymentId(Long paymentId) { this.paymentId = paymentId; return this; }
        public RefundRecordDtoBuilder amount(BigDecimal amount) { this.amount = amount; return this; }
        public RefundRecordDtoBuilder reason(String reason) { this.reason = reason; return this; }
        public RefundRecordDtoBuilder status(RefundStatus status) { this.status = status; return this; }
        public RefundRecordDtoBuilder processedBy(String processedBy) { this.processedBy = processedBy; return this; }
        public RefundRecordDtoBuilder createdAt(String createdAt) { this.createdAt = createdAt; return this; }

        public RefundRecordDto build() {
            return new RefundRecordDto(id, refundReference, paymentId, amount, reason, status, processedBy, createdAt);
        }
    }
}
