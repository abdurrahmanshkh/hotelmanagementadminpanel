package com.smartstay.dto.payment;

import com.smartstay.enums.RefundStatus;
import com.smartstay.model.Refund;
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
public class RefundRecordDto {

    private Long id;
    private String refundReference;
    private Long paymentId;
    private BigDecimal amount;
    private String reason;
    private RefundStatus status;
    private String processedBy;
    private String createdAt;

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
}
