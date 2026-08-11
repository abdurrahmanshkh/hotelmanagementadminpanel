package com.smartstay.dto.pricing;

import com.smartstay.enums.PricingAdjustmentType;
import com.smartstay.model.PricingRule;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

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

    public PricingRuleDto() {
    }

    public PricingRuleDto(Long id, String name, Long roomTypeId, String roomTypeName, double minOccupancyPercentage, double maxOccupancyPercentage, PricingAdjustmentType adjustmentType, BigDecimal adjustmentValue, BigDecimal allowedMinPrice, BigDecimal allowedMaxPrice, boolean isActive, String createdAt) {
        this.id = id;
        this.name = name;
        this.roomTypeId = roomTypeId;
        this.roomTypeName = roomTypeName;
        this.minOccupancyPercentage = minOccupancyPercentage;
        this.maxOccupancyPercentage = maxOccupancyPercentage;
        this.adjustmentType = adjustmentType;
        this.adjustmentValue = adjustmentValue;
        this.allowedMinPrice = allowedMinPrice;
        this.allowedMaxPrice = allowedMaxPrice;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getRoomTypeId() { return roomTypeId; }
    public void setRoomTypeId(Long roomTypeId) { this.roomTypeId = roomTypeId; }

    public String getRoomTypeName() { return roomTypeName; }
    public void setRoomTypeName(String roomTypeName) { this.roomTypeName = roomTypeName; }

    public double getMinOccupancyPercentage() { return minOccupancyPercentage; }
    public void setMinOccupancyPercentage(double minOccupancyPercentage) { this.minOccupancyPercentage = minOccupancyPercentage; }

    public double getMaxOccupancyPercentage() { return maxOccupancyPercentage; }
    public void setMaxOccupancyPercentage(double maxOccupancyPercentage) { this.maxOccupancyPercentage = maxOccupancyPercentage; }

    public PricingAdjustmentType getAdjustmentType() { return adjustmentType; }
    public void setAdjustmentType(PricingAdjustmentType adjustmentType) { this.adjustmentType = adjustmentType; }

    public BigDecimal getAdjustmentValue() { return adjustmentValue; }
    public void setAdjustmentValue(BigDecimal adjustmentValue) { this.adjustmentValue = adjustmentValue; }

    public BigDecimal getAllowedMinPrice() { return allowedMinPrice; }
    public void setAllowedMinPrice(BigDecimal allowedMinPrice) { this.allowedMinPrice = allowedMinPrice; }

    public BigDecimal getAllowedMaxPrice() { return allowedMaxPrice; }
    public void setAllowedMaxPrice(BigDecimal allowedMaxPrice) { this.allowedMaxPrice = allowedMaxPrice; }

    public boolean isActive() { return isActive; }
    public boolean getIsActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

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

    public static PricingRuleDtoBuilder builder() {
        return new PricingRuleDtoBuilder();
    }

    public static class PricingRuleDtoBuilder {
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

        public PricingRuleDtoBuilder id(Long id) { this.id = id; return this; }
        public PricingRuleDtoBuilder name(String name) { this.name = name; return this; }
        public PricingRuleDtoBuilder roomTypeId(Long roomTypeId) { this.roomTypeId = roomTypeId; return this; }
        public PricingRuleDtoBuilder roomTypeName(String roomTypeName) { this.roomTypeName = roomTypeName; return this; }
        public PricingRuleDtoBuilder minOccupancyPercentage(double minOccupancyPercentage) { this.minOccupancyPercentage = minOccupancyPercentage; return this; }
        public PricingRuleDtoBuilder maxOccupancyPercentage(double maxOccupancyPercentage) { this.maxOccupancyPercentage = maxOccupancyPercentage; return this; }
        public PricingRuleDtoBuilder adjustmentType(PricingAdjustmentType adjustmentType) { this.adjustmentType = adjustmentType; return this; }
        public PricingRuleDtoBuilder adjustmentValue(BigDecimal adjustmentValue) { this.adjustmentValue = adjustmentValue; return this; }
        public PricingRuleDtoBuilder allowedMinPrice(BigDecimal allowedMinPrice) { this.allowedMinPrice = allowedMinPrice; return this; }
        public PricingRuleDtoBuilder allowedMaxPrice(BigDecimal allowedMaxPrice) { this.allowedMaxPrice = allowedMaxPrice; return this; }
        public PricingRuleDtoBuilder isActive(boolean isActive) { this.isActive = isActive; return this; }
        public PricingRuleDtoBuilder createdAt(String createdAt) { this.createdAt = createdAt; return this; }

        public PricingRuleDto build() {
            return new PricingRuleDto(id, name, roomTypeId, roomTypeName, minOccupancyPercentage, maxOccupancyPercentage, adjustmentType, adjustmentValue, allowedMinPrice, allowedMaxPrice, isActive, createdAt);
        }
    }
}
