package com.smartstay.dto.payment;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RefundRequestDto {
    @NotNull(message = "Amount is required")
    private BigDecimal amount;
    private String reason;
}
