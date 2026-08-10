package com.smartstay.service;

import com.smartstay.dto.settings.HotelSettingsDto;
import com.smartstay.dto.settings.UpdateHotelSettingsRequestDto;
import com.smartstay.model.HotelSettings;
import com.smartstay.repository.HotelSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final HotelSettingsRepository settingsRepository;

    @Transactional(readOnly = true)
    public HotelSettingsDto getSettings() {
        HotelSettings settings = settingsRepository.findById(1L).orElseGet(() ->
                HotelSettings.builder()
                        .id(1L)
                        .hotelName("SmartStay Luxury Hotel & Suites")
                        .address("123 Beach Resort Boulevard, Goa, India")
                        .phone("+91 98765 43210")
                        .email("support@smartstay.com")
                        .checkInTime("14:00")
                        .checkOutTime("11:00")
                        .currency("INR")
                        .taxPercentage(12.0)
                        .serviceFeePercentage(5.0)
                        .isDynamicPricingEnabled(true)
                        .build());
        return HotelSettingsDto.fromEntity(settings);
    }

    @Transactional
    public HotelSettingsDto updateSettings(UpdateHotelSettingsRequestDto req, String updatedBy) {
        HotelSettings settings = settingsRepository.findById(1L).orElseGet(() -> HotelSettings.builder().id(1L).build());

        if (req.getHotelName() != null) settings.setHotelName(req.getHotelName());
        if (req.getAddress() != null) settings.setAddress(req.getAddress());
        if (req.getPhone() != null) settings.setPhone(req.getPhone());
        if (req.getEmail() != null) settings.setEmail(req.getEmail());
        if (req.getCheckInTime() != null) settings.setCheckInTime(req.getCheckInTime());
        if (req.getCheckOutTime() != null) settings.setCheckOutTime(req.getCheckOutTime());
        if (req.getMaxStayDays() != null) settings.setMaxStayDays(req.getMaxStayDays());
        if (req.getPendingPaymentTimeoutMinutes() != null) settings.setPendingPaymentTimeoutMinutes(req.getPendingPaymentTimeoutMinutes());
        if (req.getCancellationCutoffHours() != null) settings.setCancellationCutoffHours(req.getCancellationCutoffHours());
        if (req.getCurrency() != null) settings.setCurrency(req.getCurrency());
        if (req.getTaxPercentage() != null) settings.setTaxPercentage(req.getTaxPercentage());
        if (req.getServiceFeePercentage() != null) settings.setServiceFeePercentage(req.getServiceFeePercentage());
        if (req.getIsDynamicPricingEnabled() != null) settings.setIsDynamicPricingEnabled(req.getIsDynamicPricingEnabled());
        if (req.getDynamicPricingPolicyNotes() != null) settings.setDynamicPricingPolicyNotes(req.getDynamicPricingPolicyNotes());

        settings.setUpdatedBy(updatedBy != null ? updatedBy : "System Admin");
        settings = settingsRepository.save(settings);
        return HotelSettingsDto.fromEntity(settings);
    }
}
