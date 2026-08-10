package com.smartstay.dto.pricing;

import com.smartstay.enums.PricingAdjustmentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PricingPreviewResultDto {
    private Long roomTypeId;
    private String roomTypeName;
    private String targetDate;
    private BigDecimal basePrice;
    private long totalRooms;
    private long occupiedRooms;
    private double occupancyPercentage;
    private String appliedRuleName;
    private PricingAdjustmentType adjustmentType;
    private BigDecimal adjustmentValue;
    private BigDecimal calculatedPrice;
    private BigDecimal clampedFinalPrice;
    private String currency;
}
