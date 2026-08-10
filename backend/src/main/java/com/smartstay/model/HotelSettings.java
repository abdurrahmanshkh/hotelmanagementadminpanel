package com.smartstay.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "hotel_settings")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    @Builder.Default
    private String currency = "INR";

    @Column(name = "timezone")
    @Builder.Default
    private String timezone = "Asia/Kolkata";

    @Column(name = "check_in_time")
    @Builder.Default
    private String checkInTime = "14:00";

    @Column(name = "check_out_time")
    @Builder.Default
    private String checkOutTime = "11:00";

    @Column(name = "tax_percentage")
    @Builder.Default
    private Double taxPercentage = 12.0;

    @Column(name = "service_fee_percentage")
    @Builder.Default
    private Double serviceFeePercentage = 5.0;

    @Column(name = "max_stay_days")
    @Builder.Default
    private Integer maxStayDays = 30;

    @Column(name = "pending_payment_timeout_minutes")
    @Builder.Default
    private Integer pendingPaymentTimeoutMinutes = 15;

    @Column(name = "cancellation_cutoff_hours")
    @Builder.Default
    private Integer cancellationCutoffHours = 24;

    @Column(name = "is_dynamic_pricing_enabled")
    @Builder.Default
    private Boolean isDynamicPricingEnabled = true;

    @Column(name = "dynamic_pricing_policy_notes")
    private String dynamicPricingPolicyNotes;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onSave() {
        this.updatedAt = LocalDateTime.now();
        if (this.currency == null) this.currency = "INR";
        if (this.taxPercentage == null) this.taxPercentage = 12.0;
        if (this.serviceFeePercentage == null) this.serviceFeePercentage = 5.0;
        if (this.isDynamicPricingEnabled == null) this.isDynamicPricingEnabled = true;
    }
}
