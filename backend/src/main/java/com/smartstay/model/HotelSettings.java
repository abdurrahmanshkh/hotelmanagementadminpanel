package com.smartstay.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "hotel_settings")
public class HotelSettings {

    @Id
    private Long id = 1L;

    @Column(name = "hotel_name", nullable = false)
    private String hotelName;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    @Column(name = "currency", nullable = false)
    private String currency = "INR";

    @Column(name = "timezone")
    private String timezone = "Asia/Kolkata";

    @Column(name = "check_in_time")
    private String checkInTime = "14:00";

    @Column(name = "check_out_time")
    private String checkOutTime = "11:00";

    @Column(name = "tax_percentage")
    private Double taxPercentage = 12.0;

    @Column(name = "service_fee_percentage")
    private Double serviceFeePercentage = 5.0;

    @Column(name = "max_stay_days")
    private Integer maxStayDays = 30;

    @Column(name = "pending_payment_timeout_minutes")
    private Integer pendingPaymentTimeoutMinutes = 15;

    @Column(name = "cancellation_cutoff_hours")
    private Integer cancellationCutoffHours = 24;

    @Column(name = "is_dynamic_pricing_enabled")
    private Boolean isDynamicPricingEnabled = true;

    @Column(name = "dynamic_pricing_policy_notes")
    private String dynamicPricingPolicyNotes;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public HotelSettings() {
    }

    public HotelSettings(Long id, String hotelName, String address, String phone, String email, String currency, String timezone, String checkInTime, String checkOutTime, Double taxPercentage, Double serviceFeePercentage, Integer maxStayDays, Integer pendingPaymentTimeoutMinutes, Integer cancellationCutoffHours, Boolean isDynamicPricingEnabled, String dynamicPricingPolicyNotes, String updatedBy, LocalDateTime updatedAt) {
        this.id = id != null ? id : 1L;
        this.hotelName = hotelName;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.currency = currency != null ? currency : "INR";
        this.timezone = timezone != null ? timezone : "Asia/Kolkata";
        this.checkInTime = checkInTime != null ? checkInTime : "14:00";
        this.checkOutTime = checkOutTime != null ? checkOutTime : "11:00";
        this.taxPercentage = taxPercentage != null ? taxPercentage : 12.0;
        this.serviceFeePercentage = serviceFeePercentage != null ? serviceFeePercentage : 5.0;
        this.maxStayDays = maxStayDays != null ? maxStayDays : 30;
        this.pendingPaymentTimeoutMinutes = pendingPaymentTimeoutMinutes != null ? pendingPaymentTimeoutMinutes : 15;
        this.cancellationCutoffHours = cancellationCutoffHours != null ? cancellationCutoffHours : 24;
        this.isDynamicPricingEnabled = isDynamicPricingEnabled != null ? isDynamicPricingEnabled : true;
        this.dynamicPricingPolicyNotes = dynamicPricingPolicyNotes;
        this.updatedBy = updatedBy;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    @PreUpdate
    protected void onSave() {
        this.updatedAt = LocalDateTime.now();
        if (this.currency == null) this.currency = "INR";
        if (this.taxPercentage == null) this.taxPercentage = 12.0;
        if (this.serviceFeePercentage == null) this.serviceFeePercentage = 5.0;
        if (this.isDynamicPricingEnabled == null) this.isDynamicPricingEnabled = true;
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

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public String getCheckInTime() { return checkInTime; }
    public void setCheckInTime(String checkInTime) { this.checkInTime = checkInTime; }

    public String getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(String checkOutTime) { this.checkOutTime = checkOutTime; }

    public Double getTaxPercentage() { return taxPercentage; }
    public void setTaxPercentage(Double taxPercentage) { this.taxPercentage = taxPercentage; }

    public Double getServiceFeePercentage() { return serviceFeePercentage; }
    public void setServiceFeePercentage(Double serviceFeePercentage) { this.serviceFeePercentage = serviceFeePercentage; }

    public Integer getMaxStayDays() { return maxStayDays; }
    public void setMaxStayDays(Integer maxStayDays) { this.maxStayDays = maxStayDays; }

    public Integer getPendingPaymentTimeoutMinutes() { return pendingPaymentTimeoutMinutes; }
    public void setPendingPaymentTimeoutMinutes(Integer pendingPaymentTimeoutMinutes) { this.pendingPaymentTimeoutMinutes = pendingPaymentTimeoutMinutes; }

    public Integer getCancellationCutoffHours() { return cancellationCutoffHours; }
    public void setCancellationCutoffHours(Integer cancellationCutoffHours) { this.cancellationCutoffHours = cancellationCutoffHours; }

    public Boolean getIsDynamicPricingEnabled() { return isDynamicPricingEnabled; }
    public void setIsDynamicPricingEnabled(Boolean isDynamicPricingEnabled) { this.isDynamicPricingEnabled = isDynamicPricingEnabled; }

    public String getDynamicPricingPolicyNotes() { return dynamicPricingPolicyNotes; }
    public void setDynamicPricingPolicyNotes(String dynamicPricingPolicyNotes) { this.dynamicPricingPolicyNotes = dynamicPricingPolicyNotes; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static HotelSettingsBuilder builder() {
        return new HotelSettingsBuilder();
    }

    public static class HotelSettingsBuilder {
        private Long id = 1L;
        private String hotelName;
        private String address;
        private String phone;
        private String email;
        private String currency = "INR";
        private String timezone = "Asia/Kolkata";
        private String checkInTime = "14:00";
        private String checkOutTime = "11:00";
        private Double taxPercentage = 12.0;
        private Double serviceFeePercentage = 5.0;
        private Integer maxStayDays = 30;
        private Integer pendingPaymentTimeoutMinutes = 15;
        private Integer cancellationCutoffHours = 24;
        private Boolean isDynamicPricingEnabled = true;
        private String dynamicPricingPolicyNotes;
        private String updatedBy;
        private LocalDateTime updatedAt;

        public HotelSettingsBuilder id(Long id) { this.id = id; return this; }
        public HotelSettingsBuilder hotelName(String hotelName) { this.hotelName = hotelName; return this; }
        public HotelSettingsBuilder address(String address) { this.address = address; return this; }
        public HotelSettingsBuilder phone(String phone) { this.phone = phone; return this; }
        public HotelSettingsBuilder email(String email) { this.email = email; return this; }
        public HotelSettingsBuilder currency(String currency) { this.currency = currency; return this; }
        public HotelSettingsBuilder timezone(String timezone) { this.timezone = timezone; return this; }
        public HotelSettingsBuilder checkInTime(String checkInTime) { this.checkInTime = checkInTime; return this; }
        public HotelSettingsBuilder checkOutTime(String checkOutTime) { this.checkOutTime = checkOutTime; return this; }
        public HotelSettingsBuilder taxPercentage(Double taxPercentage) { this.taxPercentage = taxPercentage; return this; }
        public HotelSettingsBuilder serviceFeePercentage(Double serviceFeePercentage) { this.serviceFeePercentage = serviceFeePercentage; return this; }
        public HotelSettingsBuilder maxStayDays(Integer maxStayDays) { this.maxStayDays = maxStayDays; return this; }
        public HotelSettingsBuilder pendingPaymentTimeoutMinutes(Integer pendingPaymentTimeoutMinutes) { this.pendingPaymentTimeoutMinutes = pendingPaymentTimeoutMinutes; return this; }
        public HotelSettingsBuilder cancellationCutoffHours(Integer cancellationCutoffHours) { this.cancellationCutoffHours = cancellationCutoffHours; return this; }
        public HotelSettingsBuilder isDynamicPricingEnabled(Boolean isDynamicPricingEnabled) { this.isDynamicPricingEnabled = isDynamicPricingEnabled; return this; }
        public HotelSettingsBuilder dynamicPricingPolicyNotes(String dynamicPricingPolicyNotes) { this.dynamicPricingPolicyNotes = dynamicPricingPolicyNotes; return this; }
        public HotelSettingsBuilder updatedBy(String updatedBy) { this.updatedBy = updatedBy; return this; }
        public HotelSettingsBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public HotelSettings build() {
            return new HotelSettings(id, hotelName, address, phone, email, currency, timezone, checkInTime, checkOutTime, taxPercentage, serviceFeePercentage, maxStayDays, pendingPaymentTimeoutMinutes, cancellationCutoffHours, isDynamicPricingEnabled, dynamicPricingPolicyNotes, updatedBy, updatedAt);
        }
    }
}
