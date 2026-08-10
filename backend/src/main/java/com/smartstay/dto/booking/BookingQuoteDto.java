package com.smartstay.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingQuoteDto {

    private String quoteId;
    private Long roomId;
    private int numberOfNights;
    private BigDecimal basePricePerNight;
    private BigDecimal appliedPricePerNight;
    private BigDecimal roomAmount;
    private double taxPercentage;
    private BigDecimal taxAmount;
    private double serviceFeePercentage;
    private BigDecimal serviceFee;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private String currency;
    private String validUntil;
}
