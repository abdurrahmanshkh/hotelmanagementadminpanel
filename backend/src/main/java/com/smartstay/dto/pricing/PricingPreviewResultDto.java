package com.smartstay.dto.pricing;

import com.smartstay.enums.PricingAdjustmentType;

import java.math.BigDecimal;

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

    public PricingPreviewResultDto() {
    }

    public PricingPreviewResultDto(Long roomTypeId, String roomTypeName, String targetDate, BigDecimal basePrice, long totalRooms, long occupiedRooms, double occupancyPercentage, String appliedRuleName, PricingAdjustmentType adjustmentType, BigDecimal adjustmentValue, BigDecimal calculatedPrice, BigDecimal clampedFinalPrice, String currency) {
        this.roomTypeId = roomTypeId;
        this.roomTypeName = roomTypeName;
        this.targetDate = targetDate;
        this.basePrice = basePrice;
        this.totalRooms = totalRooms;
        this.occupiedRooms = occupiedRooms;
        this.occupancyPercentage = occupancyPercentage;
        this.appliedRuleName = appliedRuleName;
        this.adjustmentType = adjustmentType;
        this.adjustmentValue = adjustmentValue;
        this.calculatedPrice = calculatedPrice;
        this.clampedFinalPrice = clampedFinalPrice;
        this.currency = currency;
    }

    public Long getRoomTypeId() { return roomTypeId; }
    public void setRoomTypeId(Long roomTypeId) { this.roomTypeId = roomTypeId; }

    public String getRoomTypeName() { return roomTypeName; }
    public void setRoomTypeName(String roomTypeName) { this.roomTypeName = roomTypeName; }

    public String getTargetDate() { return targetDate; }
    public void setTargetDate(String targetDate) { this.targetDate = targetDate; }

    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }

    public long getTotalRooms() { return totalRooms; }
    public void setTotalRooms(long totalRooms) { this.totalRooms = totalRooms; }

    public long getOccupiedRooms() { return occupiedRooms; }
    public void setOccupiedRooms(long occupiedRooms) { this.occupiedRooms = occupiedRooms; }

    public double getOccupancyPercentage() { return occupancyPercentage; }
    public void setOccupancyPercentage(double occupancyPercentage) { this.occupancyPercentage = occupancyPercentage; }

    public String getAppliedRuleName() { return appliedRuleName; }
    public void setAppliedRuleName(String appliedRuleName) { this.appliedRuleName = appliedRuleName; }

    public PricingAdjustmentType getAdjustmentType() { return adjustmentType; }
    public void setAdjustmentType(PricingAdjustmentType adjustmentType) { this.adjustmentType = adjustmentType; }

    public BigDecimal getAdjustmentValue() { return adjustmentValue; }
    public void setAdjustmentValue(BigDecimal adjustmentValue) { this.adjustmentValue = adjustmentValue; }

    public BigDecimal getCalculatedPrice() { return calculatedPrice; }
    public void setCalculatedPrice(BigDecimal calculatedPrice) { this.calculatedPrice = calculatedPrice; }

    public BigDecimal getClampedFinalPrice() { return clampedFinalPrice; }
    public void setClampedFinalPrice(BigDecimal clampedFinalPrice) { this.clampedFinalPrice = clampedFinalPrice; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public static PricingPreviewResultDtoBuilder builder() {
        return new PricingPreviewResultDtoBuilder();
    }

    public static class PricingPreviewResultDtoBuilder {
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

        public PricingPreviewResultDtoBuilder roomTypeId(Long roomTypeId) { this.roomTypeId = roomTypeId; return this; }
        public PricingPreviewResultDtoBuilder roomTypeName(String roomTypeName) { this.roomTypeName = roomTypeName; return this; }
        public PricingPreviewResultDtoBuilder targetDate(String targetDate) { this.targetDate = targetDate; return this; }
        public PricingPreviewResultDtoBuilder basePrice(BigDecimal basePrice) { this.basePrice = basePrice; return this; }
        public PricingPreviewResultDtoBuilder totalRooms(long totalRooms) { this.totalRooms = totalRooms; return this; }
        public PricingPreviewResultDtoBuilder occupiedRooms(long occupiedRooms) { this.occupiedRooms = occupiedRooms; return this; }
        public PricingPreviewResultDtoBuilder occupancyPercentage(double occupancyPercentage) { this.occupancyPercentage = occupancyPercentage; return this; }
        public PricingPreviewResultDtoBuilder appliedRuleName(String appliedRuleName) { this.appliedRuleName = appliedRuleName; return this; }
        public PricingPreviewResultDtoBuilder adjustmentType(PricingAdjustmentType adjustmentType) { this.adjustmentType = adjustmentType; return this; }
        public PricingPreviewResultDtoBuilder adjustmentValue(BigDecimal adjustmentValue) { this.adjustmentValue = adjustmentValue; return this; }
        public PricingPreviewResultDtoBuilder calculatedPrice(BigDecimal calculatedPrice) { this.calculatedPrice = calculatedPrice; return this; }
        public PricingPreviewResultDtoBuilder clampedFinalPrice(BigDecimal clampedFinalPrice) { this.clampedFinalPrice = clampedFinalPrice; return this; }
        public PricingPreviewResultDtoBuilder currency(String currency) { this.currency = currency; return this; }

        public PricingPreviewResultDto build() {
            return new PricingPreviewResultDto(roomTypeId, roomTypeName, targetDate, basePrice, totalRooms, occupiedRooms, occupancyPercentage, appliedRuleName, adjustmentType, adjustmentValue, calculatedPrice, clampedFinalPrice, currency);
        }
    }
}
