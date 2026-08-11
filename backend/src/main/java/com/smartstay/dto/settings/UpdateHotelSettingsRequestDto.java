package com.smartstay.dto.settings;

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

    public UpdateHotelSettingsRequestDto() {
    }

    public UpdateHotelSettingsRequestDto(String hotelName, String address, String phone, String email, String checkInTime, String checkOutTime, Integer maxStayDays, Integer pendingPaymentTimeoutMinutes, Integer cancellationCutoffHours, String currency, Double taxPercentage, Double serviceFeePercentage, Boolean isDynamicPricingEnabled, String dynamicPricingPolicyNotes) {
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
    }

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

    public Integer getMaxStayDays() { return maxStayDays; }
    public void setMaxStayDays(Integer maxStayDays) { this.maxStayDays = maxStayDays; }

    public Integer getPendingPaymentTimeoutMinutes() { return pendingPaymentTimeoutMinutes; }
    public void setPendingPaymentTimeoutMinutes(Integer pendingPaymentTimeoutMinutes) { this.pendingPaymentTimeoutMinutes = pendingPaymentTimeoutMinutes; }

    public Integer getCancellationCutoffHours() { return cancellationCutoffHours; }
    public void setCancellationCutoffHours(Integer cancellationCutoffHours) { this.cancellationCutoffHours = cancellationCutoffHours; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public Double getTaxPercentage() { return taxPercentage; }
    public void setTaxPercentage(Double taxPercentage) { this.taxPercentage = taxPercentage; }

    public Double getServiceFeePercentage() { return serviceFeePercentage; }
    public void setServiceFeePercentage(Double serviceFeePercentage) { this.serviceFeePercentage = serviceFeePercentage; }

    public Boolean getIsDynamicPricingEnabled() { return isDynamicPricingEnabled; }
    public void setIsDynamicPricingEnabled(Boolean isDynamicPricingEnabled) { this.isDynamicPricingEnabled = isDynamicPricingEnabled; }

    public String getDynamicPricingPolicyNotes() { return dynamicPricingPolicyNotes; }
    public void setDynamicPricingPolicyNotes(String dynamicPricingPolicyNotes) { this.dynamicPricingPolicyNotes = dynamicPricingPolicyNotes; }
}
