package com.smartstay.dto.room;

import com.smartstay.model.RoomType;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public class RoomTypeDto {

    private Long id;
    private String name;
    private String code;
    private String description;
    private BigDecimal basePrice;
    private BigDecimal minimumPrice;
    private BigDecimal maximumPrice;
    private int maximumAdults;
    private int maximumChildren;
    private String bedType;
    private int roomSizeSqft;
    private boolean active;
    private List<AmenityDto> amenities;

    public RoomTypeDto() {
    }

    public RoomTypeDto(Long id, String name, String code, String description, BigDecimal basePrice, BigDecimal minimumPrice, BigDecimal maximumPrice, int maximumAdults, int maximumChildren, String bedType, int roomSizeSqft, boolean active, List<AmenityDto> amenities) {
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
        this.active = active;
        this.amenities = amenities;
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

    public int getMaximumAdults() { return maximumAdults; }
    public void setMaximumAdults(int maximumAdults) { this.maximumAdults = maximumAdults; }

    public int getMaximumChildren() { return maximumChildren; }
    public void setMaximumChildren(int maximumChildren) { this.maximumChildren = maximumChildren; }

    public String getBedType() { return bedType; }
    public void setBedType(String bedType) { this.bedType = bedType; }

    public int getRoomSizeSqft() { return roomSizeSqft; }
    public void setRoomSizeSqft(int roomSizeSqft) { this.roomSizeSqft = roomSizeSqft; }

    public boolean isActive() { return active; }
    public boolean getIsActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public int getAdultCapacity() { return maximumAdults; }
    public int getChildCapacity() { return maximumChildren; }
    public int getRoomSizeSqFt() { return roomSizeSqft; }

    public List<AmenityDto> getAmenities() { return amenities; }
    public void setAmenities(List<AmenityDto> amenities) { this.amenities = amenities; }

    public static RoomTypeDto fromEntity(RoomType roomType) {
        if (roomType == null) return null;
        return RoomTypeDto.builder()
                .id(roomType.getId())
                .name(roomType.getName())
                .code(roomType.getCode())
                .description(roomType.getDescription())
                .basePrice(roomType.getBasePrice())
                .minimumPrice(roomType.getMinimumPrice())
                .maximumPrice(roomType.getMaximumPrice())
                .maximumAdults(roomType.getMaximumAdults())
                .maximumChildren(roomType.getMaximumChildren())
                .bedType(roomType.getBedType())
                .roomSizeSqft(roomType.getRoomSizeSqft() != null ? roomType.getRoomSizeSqft() : 0)
                .active(Boolean.TRUE.equals(roomType.getActive()))
                .amenities(roomType.getAmenities() != null ?
                        roomType.getAmenities().stream().map(AmenityDto::fromEntity).collect(Collectors.toList()) : List.of())
                .build();
    }

    public static RoomTypeDtoBuilder builder() {
        return new RoomTypeDtoBuilder();
    }

    public static class RoomTypeDtoBuilder {
        private Long id;
        private String name;
        private String code;
        private String description;
        private BigDecimal basePrice;
        private BigDecimal minimumPrice;
        private BigDecimal maximumPrice;
        private int maximumAdults;
        private int maximumChildren;
        private String bedType;
        private int roomSizeSqft;
        private boolean active;
        private List<AmenityDto> amenities;

        public RoomTypeDtoBuilder id(Long id) { this.id = id; return this; }
        public RoomTypeDtoBuilder name(String name) { this.name = name; return this; }
        public RoomTypeDtoBuilder code(String code) { this.code = code; return this; }
        public RoomTypeDtoBuilder description(String description) { this.description = description; return this; }
        public RoomTypeDtoBuilder basePrice(BigDecimal basePrice) { this.basePrice = basePrice; return this; }
        public RoomTypeDtoBuilder minimumPrice(BigDecimal minimumPrice) { this.minimumPrice = minimumPrice; return this; }
        public RoomTypeDtoBuilder maximumPrice(BigDecimal maximumPrice) { this.maximumPrice = maximumPrice; return this; }
        public RoomTypeDtoBuilder maximumAdults(int maximumAdults) { this.maximumAdults = maximumAdults; return this; }
        public RoomTypeDtoBuilder maximumChildren(int maximumChildren) { this.maximumChildren = maximumChildren; return this; }
        public RoomTypeDtoBuilder bedType(String bedType) { this.bedType = bedType; return this; }
        public RoomTypeDtoBuilder roomSizeSqft(int roomSizeSqft) { this.roomSizeSqft = roomSizeSqft; return this; }
        public RoomTypeDtoBuilder active(boolean active) { this.active = active; return this; }
        public RoomTypeDtoBuilder amenities(List<AmenityDto> amenities) { this.amenities = amenities; return this; }

        public RoomTypeDto build() {
            return new RoomTypeDto(id, name, code, description, basePrice, minimumPrice, maximumPrice, maximumAdults, maximumChildren, bedType, roomSizeSqft, active, amenities);
        }
    }
}
