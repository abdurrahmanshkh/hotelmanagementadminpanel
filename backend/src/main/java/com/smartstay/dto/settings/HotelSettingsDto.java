package com.smartstay.dto.settings;

import com.smartstay.model.HotelSettings;

import java.time.format.DateTimeFormatter;

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

    public HotelSettingsDto() {
    }

    public HotelSettingsDto(Long id, String hotelName, String address, String phone, String email, String checkInTime, String checkOutTime, int maxStayDays, int pendingPaymentTimeoutMinutes, int cancellationCutoffHours, String currency, double taxPercentage, double serviceFeePercentage, boolean isDynamicPricingEnabled, String dynamicPricingPolicyNotes, String updatedBy, String updatedAt) {
        this.id = id;
        this.hotelName = hotelName;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
        this.maxStayDays = maxStayDays;
        this.pendingPaymentTimeoutMinutes = pendingPaymentTimeoutMinutes;
        this.cancellationCutoffHours = cancellationCutoffHours;
        this.currency = currency;
        this.taxPercentage = taxPercentage;
        this.serviceFeePercentage = serviceFeePercentage;
        this.isDynamicPricingEnabled = isDynamicPricingEnabled;
        this.dynamicPricingPolicyNotes = dynamicPricingPolicyNotes;
        this.updatedBy = updatedBy;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getHotelName() { return hotelName; }
    public void setHotelName(String hotelName) { this.hotelName = hotelName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCheckInTime() { return checkInTime; }
    public void setCheckInTime(String checkInTime) { this.checkInTime = checkInTime; }

    public String getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(String checkOutTime) { this.checkOutTime = checkOutTime; }

    public int getMaxStayDays() { return maxStayDays; }
    public void setMaxStayDays(int maxStayDays) { this.maxStayDays = maxStayDays; }

    public int getPendingPaymentTimeoutMinutes() { return pendingPaymentTimeoutMinutes; }
    public void setPendingPaymentTimeoutMinutes(int pendingPaymentTimeoutMinutes) { this.pendingPaymentTimeoutMinutes = pendingPaymentTimeoutMinutes; }

    public int getCancellationCutoffHours() { return cancellationCutoffHours; }
    public void setCancellationCutoffHours(int cancellationCutoffHours) { this.cancellationCutoffHours = cancellationCutoffHours; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public double getTaxPercentage() { return taxPercentage; }
    public void setTaxPercentage(double taxPercentage) { this.taxPercentage = taxPercentage; }

    public double getServiceFeePercentage() { return serviceFeePercentage; }
    public void setServiceFeePercentage(double serviceFeePercentage) { this.serviceFeePercentage = serviceFeePercentage; }

    public boolean isDynamicPricingEnabled() { return isDynamicPricingEnabled; }
    public void setDynamicPricingEnabled(boolean isDynamicPricingEnabled) { this.isDynamicPricingEnabled = isDynamicPricingEnabled; }

    public String getDynamicPricingPolicyNotes() { return dynamicPricingPolicyNotes; }
    public void setDynamicPricingPolicyNotes(String dynamicPricingPolicyNotes) { this.dynamicPricingPolicyNotes = dynamicPricingPolicyNotes; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

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

    public static HotelSettingsDtoBuilder builder() {
        return new HotelSettingsDtoBuilder();
    }

    public static class HotelSettingsDtoBuilder {
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

        public HotelSettingsDtoBuilder id(Long id) { this.id = id; return this; }
        public HotelSettingsDtoBuilder hotelName(String hotelName) { this.hotelName = hotelName; return this; }
        public HotelSettingsDtoBuilder address(String address) { this.address = address; return this; }
        public HotelSettingsDtoBuilder phone(String phone) { this.phone = phone; return this; }
        public HotelSettingsDtoBuilder email(String email) { this.email = email; return this; }
        public HotelSettingsDtoBuilder checkInTime(String checkInTime) { this.checkInTime = checkInTime; return this; }
        public HotelSettingsDtoBuilder checkOutTime(String checkOutTime) { this.checkOutTime = checkOutTime; return this; }
        public HotelSettingsDtoBuilder maxStayDays(int maxStayDays) { this.maxStayDays = maxStayDays; return this; }
        public HotelSettingsDtoBuilder pendingPaymentTimeoutMinutes(int pendingPaymentTimeoutMinutes) { this.pendingPaymentTimeoutMinutes = pendingPaymentTimeoutMinutes; return this; }
        public HotelSettingsDtoBuilder cancellationCutoffHours(int cancellationCutoffHours) { this.cancellationCutoffHours = cancellationCutoffHours; return this; }
        public HotelSettingsDtoBuilder currency(String currency) { this.currency = currency; return this; }
        public HotelSettingsDtoBuilder taxPercentage(double taxPercentage) { this.taxPercentage = taxPercentage; return this; }
        public HotelSettingsDtoBuilder serviceFeePercentage(double serviceFeePercentage) { this.serviceFeePercentage = serviceFeePercentage; return this; }
        public HotelSettingsDtoBuilder isDynamicPricingEnabled(boolean isDynamicPricingEnabled) { this.isDynamicPricingEnabled = isDynamicPricingEnabled; return this; }
        public HotelSettingsDtoBuilder dynamicPricingPolicyNotes(String dynamicPricingPolicyNotes) { this.dynamicPricingPolicyNotes = dynamicPricingPolicyNotes; return this; }
        public HotelSettingsDtoBuilder updatedBy(String updatedBy) { this.updatedBy = updatedBy; return this; }
        public HotelSettingsDtoBuilder updatedAt(String updatedAt) { this.updatedAt = updatedAt; return this; }

        public HotelSettingsDto build() {
            return new HotelSettingsDto(id, hotelName, address, phone, email, checkInTime, checkOutTime, maxStayDays, pendingPaymentTimeoutMinutes, cancellationCutoffHours, currency, taxPercentage, serviceFeePercentage, isDynamicPricingEnabled, dynamicPricingPolicyNotes, updatedBy, updatedAt);
        }
    }
}
