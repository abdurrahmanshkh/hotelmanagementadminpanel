package com.smartstay.model;

import com.smartstay.enums.PricingAdjustmentType;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pricing_rules")
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
    private Boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public PricingRule() {
    }

    public PricingRule(Long id, RoomType roomType, String name, Double minimumOccupancyPercentage, Double maximumOccupancyPercentage, PricingAdjustmentType adjustmentType, BigDecimal adjustmentValue, BigDecimal minimumPrice, BigDecimal maximumPrice, Boolean active, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.roomType = roomType;
        this.name = name;
        this.minimumOccupancyPercentage = minimumOccupancyPercentage;
        this.maximumOccupancyPercentage = maximumOccupancyPercentage;
        this.adjustmentType = adjustmentType;
        this.adjustmentValue = adjustmentValue;
        this.minimumPrice = minimumPrice;
        this.maximumPrice = maximumPrice;
        this.active = active != null ? active : true;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

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

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public RoomType getRoomType() { return roomType; }
    public void setRoomType(RoomType roomType) { this.roomType = roomType; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getMinimumOccupancyPercentage() { return minimumOccupancyPercentage; }
    public void setMinimumOccupancyPercentage(Double minimumOccupancyPercentage) { this.minimumOccupancyPercentage = minimumOccupancyPercentage; }

    public Double getMaximumOccupancyPercentage() { return maximumOccupancyPercentage; }
    public void setMaximumOccupancyPercentage(Double maximumOccupancyPercentage) { this.maximumOccupancyPercentage = maximumOccupancyPercentage; }

    public PricingAdjustmentType getAdjustmentType() { return adjustmentType; }
    public void setAdjustmentType(PricingAdjustmentType adjustmentType) { this.adjustmentType = adjustmentType; }

    public BigDecimal getAdjustmentValue() { return adjustmentValue; }
    public void setAdjustmentValue(BigDecimal adjustmentValue) { this.adjustmentValue = adjustmentValue; }

    public BigDecimal getMinimumPrice() { return minimumPrice; }
    public void setMinimumPrice(BigDecimal minimumPrice) { this.minimumPrice = minimumPrice; }

    public BigDecimal getMaximumPrice() { return maximumPrice; }
    public void setMaximumPrice(BigDecimal maximumPrice) { this.maximumPrice = maximumPrice; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static PricingRuleBuilder builder() {
        return new PricingRuleBuilder();
    }

    public static class PricingRuleBuilder {
        private Long id;
        private RoomType roomType;
        private String name;
        private Double minimumOccupancyPercentage;
        private Double maximumOccupancyPercentage;
        private PricingAdjustmentType adjustmentType;
        private BigDecimal adjustmentValue;
        private BigDecimal minimumPrice;
        private BigDecimal maximumPrice;
        private Boolean active = true;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public PricingRuleBuilder id(Long id) { this.id = id; return this; }
        public PricingRuleBuilder roomType(RoomType roomType) { this.roomType = roomType; return this; }
        public PricingRuleBuilder name(String name) { this.name = name; return this; }
        public PricingRuleBuilder minimumOccupancyPercentage(Double minimumOccupancyPercentage) { this.minimumOccupancyPercentage = minimumOccupancyPercentage; return this; }
        public PricingRuleBuilder maximumOccupancyPercentage(Double maximumOccupancyPercentage) { this.maximumOccupancyPercentage = maximumOccupancyPercentage; return this; }
        public PricingRuleBuilder adjustmentType(PricingAdjustmentType adjustmentType) { this.adjustmentType = adjustmentType; return this; }
        public PricingRuleBuilder adjustmentValue(BigDecimal adjustmentValue) { this.adjustmentValue = adjustmentValue; return this; }
        public PricingRuleBuilder minimumPrice(BigDecimal minimumPrice) { this.minimumPrice = minimumPrice; return this; }
        public PricingRuleBuilder maximumPrice(BigDecimal maximumPrice) { this.maximumPrice = maximumPrice; return this; }
        public PricingRuleBuilder active(Boolean active) { this.active = active; return this; }
        public PricingRuleBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public PricingRuleBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public PricingRule build() {
            return new PricingRule(id, roomType, name, minimumOccupancyPercentage, maximumOccupancyPercentage, adjustmentType, adjustmentValue, minimumPrice, maximumPrice, active, createdAt, updatedAt);
        }
    }
}
