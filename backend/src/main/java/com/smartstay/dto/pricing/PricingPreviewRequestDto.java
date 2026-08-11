package com.smartstay.dto.pricing;

public class PricingPreviewRequestDto {

    private Long roomTypeId;
    private String targetDate;

    public PricingPreviewRequestDto() {
    }

    public PricingPreviewRequestDto(Long roomTypeId, String targetDate) {
        this.roomTypeId = roomTypeId;
        this.targetDate = targetDate;
    }

    public Long getRoomTypeId() { return roomTypeId; }
    public void setRoomTypeId(Long roomTypeId) { this.roomTypeId = roomTypeId; }

    public String getTargetDate() { return targetDate; }
    public void setTargetDate(String targetDate) { this.targetDate = targetDate; }
}
