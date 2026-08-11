package com.smartstay.model;

import com.smartstay.enums.RoomStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "public_id", nullable = false, unique = true)
    private String publicId;

    @Column(name = "room_number", nullable = false, unique = true)
    private String roomNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_type_id", nullable = false)
    private RoomType roomType;

    @Column(name = "floor_number", nullable = false)
    private Integer floorNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RoomStatus status = RoomStatus.AVAILABLE;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "rating", precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.valueOf(4.5);

    @Column(name = "featured", nullable = false)
    private Boolean featured = false;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @Version
    private Long version;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<RoomImage> images = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Room() {
    }

    public Room(Long id, String publicId, String roomNumber, RoomType roomType, Integer floorNumber, RoomStatus status, String description, String imageUrl, BigDecimal rating, Boolean featured, Boolean active, Long version, List<RoomImage> images, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.publicId = publicId;
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.floorNumber = floorNumber;
        this.status = status != null ? status : RoomStatus.AVAILABLE;
        this.description = description;
        this.imageUrl = imageUrl;
        this.rating = rating != null ? rating : BigDecimal.valueOf(4.5);
        this.featured = featured != null ? featured : false;
        this.active = active != null ? active : true;
        this.version = version;
        this.images = images != null ? images : new ArrayList<>();
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) this.status = RoomStatus.AVAILABLE;
        if (this.featured == null) this.featured = false;
        if (this.active == null) this.active = true;
        if (this.rating == null) this.rating = BigDecimal.valueOf(4.5);
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPublicId() { return publicId; }
    public void setPublicId(String publicId) { this.publicId = publicId; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public RoomType getRoomType() { return roomType; }
    public void setRoomType(RoomType roomType) { this.roomType = roomType; }

    public Integer getFloorNumber() { return floorNumber; }
    public void setFloorNumber(Integer floorNumber) { this.floorNumber = floorNumber; }

    public RoomStatus getStatus() { return status; }
    public void setStatus(RoomStatus status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public List<RoomImage> getImages() { return images; }
    public void setImages(List<RoomImage> images) { this.images = images; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static RoomBuilder builder() {
        return new RoomBuilder();
    }

    public static class RoomBuilder {
        private Long id;
        private String publicId;
        private String roomNumber;
        private RoomType roomType;
        private Integer floorNumber;
        private RoomStatus status = RoomStatus.AVAILABLE;
        private String description;
        private String imageUrl;
        private BigDecimal rating = BigDecimal.valueOf(4.5);
        private Boolean featured = false;
        private Boolean active = true;
        private Long version;
        private List<RoomImage> images = new ArrayList<>();
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public RoomBuilder id(Long id) { this.id = id; return this; }
        public RoomBuilder publicId(String publicId) { this.publicId = publicId; return this; }
        public RoomBuilder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public RoomBuilder roomType(RoomType roomType) { this.roomType = roomType; return this; }
        public RoomBuilder floorNumber(Integer floorNumber) { this.floorNumber = floorNumber; return this; }
        public RoomBuilder status(RoomStatus status) { this.status = status; return this; }
        public RoomBuilder description(String description) { this.description = description; return this; }
        public RoomBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public RoomBuilder rating(BigDecimal rating) { this.rating = rating; return this; }
        public RoomBuilder featured(Boolean featured) { this.featured = featured; return this; }
        public RoomBuilder active(Boolean active) { this.active = active; return this; }
        public RoomBuilder version(Long version) { this.version = version; return this; }
        public RoomBuilder images(List<RoomImage> images) { this.images = images; return this; }
        public RoomBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public RoomBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Room build() {
            return new Room(id, publicId, roomNumber, roomType, floorNumber, status, description, imageUrl, rating, featured, active, version, images, createdAt, updatedAt);
        }
    }
}
