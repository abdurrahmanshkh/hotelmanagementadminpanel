package com.smartstay.dto.room;

import com.smartstay.enums.RoomStatus;
import com.smartstay.model.Room;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public class RoomDto {

    private Long id;
    private String publicId;
    private String roomNumber;
    private RoomTypeDto roomType;
    private Long roomTypeId;
    private String roomTypeName;
    private int floorNumber;
    private int floor;
    private RoomStatus status;
    private String description;
    private BigDecimal basePrice;
    private BigDecimal currentPrice;
    private String currency;
    private int maximumAdults;
    private int maximumChildren;
    private double rating;
    private List<String> amenities;
    private List<RoomImageDto> images;
    private boolean featured;
    private boolean active;
    private boolean isActive;

    public RoomDto() {
    }

    public RoomDto(Long id, String publicId, String roomNumber, RoomTypeDto roomType, Long roomTypeId, String roomTypeName, int floorNumber, int floor, RoomStatus status, String description, BigDecimal basePrice, BigDecimal currentPrice, String currency, int maximumAdults, int maximumChildren, double rating, List<String> amenities, List<RoomImageDto> images, boolean featured, boolean active, boolean isActive) {
        this.id = id;
        this.publicId = publicId;
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.roomTypeId = roomTypeId;
        this.roomTypeName = roomTypeName;
        this.floorNumber = floorNumber;
        this.floor = floor;
        this.status = status;
        this.description = description;
        this.basePrice = basePrice;
        this.currentPrice = currentPrice;
        this.currency = currency;
        this.maximumAdults = maximumAdults;
        this.maximumChildren = maximumChildren;
        this.rating = rating;
        this.amenities = amenities;
        this.images = images;
        this.featured = featured;
        this.active = active;
        this.isActive = isActive;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPublicId() { return publicId; }
    public void setPublicId(String publicId) { this.publicId = publicId; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public RoomTypeDto getRoomType() { return roomType; }
    public void setRoomType(RoomTypeDto roomType) { this.roomType = roomType; }

    public Long getRoomTypeId() { return roomTypeId; }
    public void setRoomTypeId(Long roomTypeId) { this.roomTypeId = roomTypeId; }

    public String getRoomTypeName() { return roomTypeName; }
    public void setRoomTypeName(String roomTypeName) { this.roomTypeName = roomTypeName; }

    public int getFloorNumber() { return floorNumber; }
    public void setFloorNumber(int floorNumber) { this.floorNumber = floorNumber; }

    public int getFloor() { return floor; }
    public void setFloor(int floor) { this.floor = floor; }

    public RoomStatus getStatus() { return status; }
    public void setStatus(RoomStatus status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }

    public BigDecimal getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public int getMaximumAdults() { return maximumAdults; }
    public void setMaximumAdults(int maximumAdults) { this.maximumAdults = maximumAdults; }

    public int getMaximumChildren() { return maximumChildren; }
    public void setMaximumChildren(int maximumChildren) { this.maximumChildren = maximumChildren; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public List<String> getAmenities() { return amenities; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }

    public List<RoomImageDto> getImages() { return images; }
    public void setImages(List<RoomImageDto> images) { this.images = images; }

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public boolean getIsActive() { return isActive; }
    public void setIsActive(boolean isActive) { this.isActive = isActive; }

    public static RoomDto fromEntity(Room room, BigDecimal calculatedPrice) {
        if (room == null) return null;
        BigDecimal price = calculatedPrice != null ? calculatedPrice : (room.getRoomType() != null ? room.getRoomType().getBasePrice() : BigDecimal.ZERO);
        
        List<String> amenityNames = room.getRoomType() != null && room.getRoomType().getAmenities() != null
                ? room.getRoomType().getAmenities().stream().map(a -> a.getName()).collect(Collectors.toList())
                : List.of();

        List<RoomImageDto> imageDtos = room.getImages() != null
                ? room.getImages().stream().map(RoomImageDto::fromEntity).collect(Collectors.toList())
                : List.of();

        if (imageDtos.isEmpty() && room.getImageUrl() != null && !room.getImageUrl().isBlank()) {
            imageDtos = List.of(RoomImageDto.builder().url(room.getImageUrl()).altText(room.getRoomNumber()).displayOrder(1).build());
        }

        return RoomDto.builder()
                .id(room.getId())
                .publicId(room.getPublicId())
                .roomNumber(room.getRoomNumber())
                .roomType(RoomTypeDto.fromEntity(room.getRoomType()))
                .roomTypeId(room.getRoomType() != null ? room.getRoomType().getId() : null)
                .roomTypeName(room.getRoomType() != null ? room.getRoomType().getName() : "")
                .floorNumber(room.getFloorNumber())
                .floor(room.getFloorNumber())
                .status(room.getStatus())
                .description(room.getDescription())
                .basePrice(room.getRoomType() != null ? room.getRoomType().getBasePrice() : BigDecimal.ZERO)
                .currentPrice(price)
                .currency("INR")
                .maximumAdults(room.getRoomType() != null ? room.getRoomType().getMaximumAdults() : 2)
                .maximumChildren(room.getRoomType() != null ? room.getRoomType().getMaximumChildren() : 1)
                .rating(room.getRating() != null ? room.getRating().doubleValue() : 4.5)
                .amenities(amenityNames)
                .images(imageDtos)
                .featured(Boolean.TRUE.equals(room.getFeatured()))
                .active(Boolean.TRUE.equals(room.getActive()))
                .isActive(Boolean.TRUE.equals(room.getActive()))
                .build();
    }

    public static RoomDtoBuilder builder() {
        return new RoomDtoBuilder();
    }

    public static class RoomDtoBuilder {
        private Long id;
        private String publicId;
        private String roomNumber;
        private RoomTypeDto roomType;
        private Long roomTypeId;
        private String roomTypeName;
        private int floorNumber;
        private int floor;
        private RoomStatus status;
        private String description;
        private BigDecimal basePrice;
        private BigDecimal currentPrice;
        private String currency;
        private int maximumAdults;
        private int maximumChildren;
        private double rating;
        private List<String> amenities;
        private List<RoomImageDto> images;
        private boolean featured;
        private boolean active;
        private boolean isActive;

        public RoomDtoBuilder id(Long id) { this.id = id; return this; }
        public RoomDtoBuilder publicId(String publicId) { this.publicId = publicId; return this; }
        public RoomDtoBuilder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public RoomDtoBuilder roomType(RoomTypeDto roomType) { this.roomType = roomType; return this; }
        public RoomDtoBuilder roomTypeId(Long roomTypeId) { this.roomTypeId = roomTypeId; return this; }
        public RoomDtoBuilder roomTypeName(String roomTypeName) { this.roomTypeName = roomTypeName; return this; }
        public RoomDtoBuilder floorNumber(int floorNumber) { this.floorNumber = floorNumber; return this; }
        public RoomDtoBuilder floor(int floor) { this.floor = floor; return this; }
        public RoomDtoBuilder status(RoomStatus status) { this.status = status; return this; }
        public RoomDtoBuilder description(String description) { this.description = description; return this; }
        public RoomDtoBuilder basePrice(BigDecimal basePrice) { this.basePrice = basePrice; return this; }
        public RoomDtoBuilder currentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; return this; }
        public RoomDtoBuilder currency(String currency) { this.currency = currency; return this; }
        public RoomDtoBuilder maximumAdults(int maximumAdults) { this.maximumAdults = maximumAdults; return this; }
        public RoomDtoBuilder maximumChildren(int maximumChildren) { this.maximumChildren = maximumChildren; return this; }
        public RoomDtoBuilder rating(double rating) { this.rating = rating; return this; }
        public RoomDtoBuilder amenities(List<String> amenities) { this.amenities = amenities; return this; }
        public RoomDtoBuilder images(List<RoomImageDto> images) { this.images = images; return this; }
        public RoomDtoBuilder featured(boolean featured) { this.featured = featured; return this; }
        public RoomDtoBuilder active(boolean active) { this.active = active; return this; }
        public RoomDtoBuilder isActive(boolean isActive) { this.isActive = isActive; return this; }

        public RoomDto build() {
            return new RoomDto(id, publicId, roomNumber, roomType, roomTypeId, roomTypeName, floorNumber, floor, status, description, basePrice, currentPrice, currency, maximumAdults, maximumChildren, rating, amenities, images, featured, active, isActive);
        }
    }
}
