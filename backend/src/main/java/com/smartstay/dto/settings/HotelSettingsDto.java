package com.smartstay.dto.settings;

import com.smartstay.model.HotelSettings;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HotelSettingsDto {

    private Long id;
    private String hotelName;
    private String address;
    private String phone;
    private String email;
    private String checkInTime;
    private String checkOutTime;
    private int maxStayDays;
    private int pendingPaymentTimeoutMinutes;
    private int cancellationCutoffHours;
    private String currency;
    private double taxPercentage;
    private double serviceFeePercentage;
    private boolean isDynamicPricingEnabled;
    private String dynamicPricingPolicyNotes;
    private String updatedBy;
    private String updatedAt;

    public static HotelSettingsDto fromEntity(HotelSettings s) {
        if (s == null) return null;
        return HotelSettingsDto.builder()
                .id(s.getId())
                .hotelName(s.getHotelName())
                .address(s.getAddress())
                .phone(s.getPhone())
                .email(s.getEmail())
                .checkInTime(s.getCheckInTime())
                .checkOutTime(s.getCheckOutTime())
                .maxStayDays(s.getMaxStayDays() != null ? s.getMaxStayDays() : 30)
                .pendingPaymentTimeoutMinutes(s.getPendingPaymentTimeoutMinutes() != null ? s.getPendingPaymentTimeoutMinutes() : 15)
                .cancellationCutoffHours(s.getCancellationCutoffHours() != null ? s.getCancellationCutoffHours() : 24)
                .currency(s.getCurrency() != null ? s.getCurrency() : "INR")
                .taxPercentage(s.getTaxPercentage() != null ? s.getTaxPercentage() : 12.0)
                .serviceFeePercentage(s.getServiceFeePercentage() != null ? s.getServiceFeePercentage() : 5.0)
                .isDynamicPricingEnabled(Boolean.TRUE.equals(s.getIsDynamicPricingEnabled()))
                .dynamicPricingPolicyNotes(s.getDynamicPricingPolicyNotes())
                .updatedBy(s.getUpdatedBy())
                .updatedAt(s.getUpdatedAt() != null ? s.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .build();
    }
}
