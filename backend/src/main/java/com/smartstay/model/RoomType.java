package com.smartstay.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "room_types")
public class RoomType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "base_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal basePrice;

    @Column(name = "minimum_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal minimumPrice;

    @Column(name = "maximum_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal maximumPrice;

    @Column(name = "maximum_adults", nullable = false)
    private Integer maximumAdults;

    @Column(name = "maximum_children", nullable = false)
    private Integer maximumChildren;

    @Column(name = "bed_type")
    private String bedType;

    @Column(name = "room_size_sqft")
    private Integer roomSizeSqft;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "room_type_amenities",
            joinColumns = @JoinColumn(name = "room_type_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    private Set<Amenity> amenities = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public RoomType() {
    }

    public RoomType(Long id, String name, String code, String description, BigDecimal basePrice, BigDecimal minimumPrice, BigDecimal maximumPrice, Integer maximumAdults, Integer maximumChildren, String bedType, Integer roomSizeSqft, Boolean active, Set<Amenity> amenities, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.description = description;
        this.basePrice = basePrice;
        this.minimumPrice = minimumPrice;
        this.maximumPrice = maximumPrice;
        this.maximumAdults = maximumAdults;
        this.maximumChildren = maximumChildren;
        this.bedType = bedType;
        this.roomSizeSqft = roomSizeSqft;
        this.active = active != null ? active : true;
        this.amenities = amenities != null ? amenities : new HashSet<>();
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

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }

    public BigDecimal getMinimumPrice() { return minimumPrice; }
    public void setMinimumPrice(BigDecimal minimumPrice) { this.minimumPrice = minimumPrice; }

    public BigDecimal getMaximumPrice() { return maximumPrice; }
    public void setMaximumPrice(BigDecimal maximumPrice) { this.maximumPrice = maximumPrice; }

    public Integer getMaximumAdults() { return maximumAdults; }
    public void setMaximumAdults(Integer maximumAdults) { this.maximumAdults = maximumAdults; }

    public Integer getMaximumChildren() { return maximumChildren; }
    public void setMaximumChildren(Integer maximumChildren) { this.maximumChildren = maximumChildren; }

    public String getBedType() { return bedType; }
    public void setBedType(String bedType) { this.bedType = bedType; }

    public Integer getRoomSizeSqft() { return roomSizeSqft; }
    public void setRoomSizeSqft(Integer roomSizeSqft) { this.roomSizeSqft = roomSizeSqft; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public Set<Amenity> getAmenities() { return amenities; }
    public void setAmenities(Set<Amenity> amenities) { this.amenities = amenities; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static RoomTypeBuilder builder() {
        return new RoomTypeBuilder();
    }

    public static class RoomTypeBuilder {
        private Long id;
        private String name;
        private String code;
        private String description;
        private BigDecimal basePrice;
        private BigDecimal minimumPrice;
        private BigDecimal maximumPrice;
        private Integer maximumAdults;
        private Integer maximumChildren;
        private String bedType;
        private Integer roomSizeSqft;
        private Boolean active = true;
        private Set<Amenity> amenities = new HashSet<>();
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public RoomTypeBuilder id(Long id) { this.id = id; return this; }
        public RoomTypeBuilder name(String name) { this.name = name; return this; }
        public RoomTypeBuilder code(String code) { this.code = code; return this; }
        public RoomTypeBuilder description(String description) { this.description = description; return this; }
        public RoomTypeBuilder basePrice(BigDecimal basePrice) { this.basePrice = basePrice; return this; }
        public RoomTypeBuilder minimumPrice(BigDecimal minimumPrice) { this.minimumPrice = minimumPrice; return this; }
        public RoomTypeBuilder maximumPrice(BigDecimal maximumPrice) { this.maximumPrice = maximumPrice; return this; }
        public RoomTypeBuilder maximumAdults(Integer maximumAdults) { this.maximumAdults = maximumAdults; return this; }
        public RoomTypeBuilder maximumChildren(Integer maximumChildren) { this.maximumChildren = maximumChildren; return this; }
        public RoomTypeBuilder bedType(String bedType) { this.bedType = bedType; return this; }
        public RoomTypeBuilder roomSizeSqft(Integer roomSizeSqft) { this.roomSizeSqft = roomSizeSqft; return this; }
        public RoomTypeBuilder active(Boolean active) { this.active = active; return this; }
        public RoomTypeBuilder amenities(Set<Amenity> amenities) { this.amenities = amenities; return this; }
        public RoomTypeBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public RoomTypeBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public RoomType build() {
            return new RoomType(id, name, code, description, basePrice, minimumPrice, maximumPrice, maximumAdults, maximumChildren, bedType, roomSizeSqft, active, amenities, createdAt, updatedAt);
        }
    }
}
