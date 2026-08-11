package com.smartstay.dto.payment;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class RefundRequestDto {

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    private String reason;

    public RefundRequestDto() {
    }

    public RefundRequestDto(BigDecimal amount, String reason) {
        this.amount = amount;
        this.reason = reason;
    }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
