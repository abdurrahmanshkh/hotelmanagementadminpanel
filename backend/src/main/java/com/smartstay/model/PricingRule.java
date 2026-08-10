package com.smartstay.model;

import com.smartstay.enums.PricingAdjustmentType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pricing_rules")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PricingRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_type_id")
    private RoomType roomType;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "minimum_occupancy_percentage", nullable = false)
    private Double minimumOccupancyPercentage;

    @Column(name = "maximum_occupancy_percentage", nullable = false)
    private Double maximumOccupancyPercentage;

    @Enumerated(EnumType.STRING)
    @Column(name = "adjustment_type", nullable = false)
    private PricingAdjustmentType adjustmentType;

    @Column(name = "adjustment_value", nullable = false, precision = 12, scale = 2)
    private BigDecimal adjustmentValue;

    @Column(name = "minimum_price", precision = 12, scale = 2)
    private BigDecimal minimumPrice;

    @Column(name = "maximum_price", precision = 12, scale = 2)
    private BigDecimal maximumPrice;

    @Column(name = "active", nullable = false)
    @Builder.Default
    private Boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.active == null) this.active = true;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
