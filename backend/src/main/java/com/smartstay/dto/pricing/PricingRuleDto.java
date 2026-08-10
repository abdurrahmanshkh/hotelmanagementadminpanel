package com.smartstay.dto.pricing;

import com.smartstay.enums.PricingAdjustmentType;
import com.smartstay.model.PricingRule;
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
public class PricingRuleDto {

    private Long id;
    private String name;
    private Long roomTypeId;
    private String roomTypeName;
    private double minOccupancyPercentage;
    private double maxOccupancyPercentage;
    private PricingAdjustmentType adjustmentType;
    private BigDecimal adjustmentValue;
    private BigDecimal allowedMinPrice;
    private BigDecimal allowedMaxPrice;
    private boolean isActive;
    private String createdAt;

    public static PricingRuleDto fromEntity(PricingRule rule) {
        if (rule == null) return null;
        return PricingRuleDto.builder()
                .id(rule.getId())
                .name(rule.getName())
                .roomTypeId(rule.getRoomType() != null ? rule.getRoomType().getId() : null)
                .roomTypeName(rule.getRoomType() != null ? rule.getRoomType().getName() : "All Room Types")
                .minOccupancyPercentage(rule.getMinimumOccupancyPercentage() != null ? rule.getMinimumOccupancyPercentage() : 0.0)
                .maxOccupancyPercentage(rule.getMaximumOccupancyPercentage() != null ? rule.getMaximumOccupancyPercentage() : 100.0)
                .adjustmentType(rule.getAdjustmentType())
                .adjustmentValue(rule.getAdjustmentValue())
                .allowedMinPrice(rule.getMinimumPrice())
                .allowedMaxPrice(rule.getMaximumPrice())
                .isActive(Boolean.TRUE.equals(rule.getActive()))
                .createdAt(rule.getCreatedAt() != null ? rule.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .build();
    }
}
