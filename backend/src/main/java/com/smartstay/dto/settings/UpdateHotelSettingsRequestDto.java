package com.smartstay.dto.settings;

import lombok.Data;

@Data
public class UpdateHotelSettingsRequestDto {
    private String hotelName;
    private String address;
    private String phone;
    private String email;
    private String checkInTime;
    private String checkOutTime;
    private Integer maxStayDays;
    private Integer pendingPaymentTimeoutMinutes;
    private Integer cancellationCutoffHours;
    private String currency;
    private Double taxPercentage;
    private Double serviceFeePercentage;
    private Boolean isDynamicPricingEnabled;
    private String dynamicPricingPolicyNotes;
}
