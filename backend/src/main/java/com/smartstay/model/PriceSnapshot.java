package com.smartstay.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "price_snapshots")
public class PriceSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type_id", nullable = false)
    private RoomType roomType;

    @Column(name = "target_date", nullable = false)
    private LocalDate targetDate;

    @Column(name = "occupancy_percentage", nullable = false)
    private Double occupancyPercentage;

    @Column(name = "calculated_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal calculatedPrice;

    @Column(name = "calculated_at", nullable = false)
    private LocalDateTime calculatedAt;

    public PriceSnapshot() {
    }

    public PriceSnapshot(Long id, RoomType roomType, LocalDate targetDate, Double occupancyPercentage, BigDecimal calculatedPrice, LocalDateTime calculatedAt) {
        this.id = id;
        this.roomType = roomType;
        this.targetDate = targetDate;
        this.occupancyPercentage = occupancyPercentage;
        this.calculatedPrice = calculatedPrice;
        this.calculatedAt = calculatedAt;
    }

    @PrePersist
    protected void onCreate() {
        if (this.calculatedAt == null) {
            this.calculatedAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public RoomType getRoomType() { return roomType; }
    public void setRoomType(RoomType roomType) { this.roomType = roomType; }

    public LocalDate getTargetDate() { return targetDate; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }

    public Double getOccupancyPercentage() { return occupancyPercentage; }
    public void setOccupancyPercentage(Double occupancyPercentage) { this.occupancyPercentage = occupancyPercentage; }

    public BigDecimal getCalculatedPrice() { return calculatedPrice; }
    public void setCalculatedPrice(BigDecimal calculatedPrice) { this.calculatedPrice = calculatedPrice; }

    public LocalDateTime getCalculatedAt() { return calculatedAt; }
    public void setCalculatedAt(LocalDateTime calculatedAt) { this.calculatedAt = calculatedAt; }

    public static PriceSnapshotBuilder builder() {
        return new PriceSnapshotBuilder();
    }

    public static class PriceSnapshotBuilder {
        private Long id;
        private RoomType roomType;
        private LocalDate targetDate;
        private Double occupancyPercentage;
        private BigDecimal calculatedPrice;
        private LocalDateTime calculatedAt;

        public PriceSnapshotBuilder id(Long id) { this.id = id; return this; }
        public PriceSnapshotBuilder roomType(RoomType roomType) { this.roomType = roomType; return this; }
        public PriceSnapshotBuilder targetDate(LocalDate targetDate) { this.targetDate = targetDate; return this; }
        public PriceSnapshotBuilder occupancyPercentage(Double occupancyPercentage) { this.occupancyPercentage = occupancyPercentage; return this; }
        public PriceSnapshotBuilder calculatedPrice(BigDecimal calculatedPrice) { this.calculatedPrice = calculatedPrice; return this; }
        public PriceSnapshotBuilder calculatedAt(LocalDateTime calculatedAt) { this.calculatedAt = calculatedAt; return this; }

        public PriceSnapshot build() {
            return new PriceSnapshot(id, roomType, targetDate, occupancyPercentage, calculatedPrice, calculatedAt);
        }
    }
}
