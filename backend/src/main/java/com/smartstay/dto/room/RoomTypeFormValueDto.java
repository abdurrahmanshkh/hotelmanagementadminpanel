package com.smartstay.dto.room;

import java.math.BigDecimal;
import java.util.List;

public class RoomTypeFormValueDto {
    private String name;
    private String code;
    private String description;
    private BigDecimal basePrice;
    private BigDecimal minimumPrice;
    private BigDecimal maximumPrice;
    private Integer adultCapacity;
    private Integer maximumAdults;
    private Integer childCapacity;
    private Integer maximumChildren;
    private String bedType;
    private Integer roomSizeSqFt;
    private List<Long> amenityIds;
    private Boolean isActive;
    private Boolean active;

    public RoomTypeFormValueDto() {
    }

    public RoomTypeFormValueDto(String name, String code, String description, BigDecimal basePrice, BigDecimal minimumPrice, BigDecimal maximumPrice, Integer adultCapacity, Integer maximumAdults, Integer childCapacity, Integer maximumChildren, String bedType, Integer roomSizeSqFt, List<Long> amenityIds, Boolean isActive, Boolean active) {
        this.name = name;
        this.code = code;
        this.description = description;
        this.basePrice = basePrice;
        this.minimumPrice = minimumPrice;
        this.maximumPrice = maximumPrice;
        this.adultCapacity = adultCapacity;
        this.maximumAdults = maximumAdults;
        this.childCapacity = childCapacity;
        this.maximumChildren = maximumChildren;
        this.bedType = bedType;
        this.roomSizeSqFt = roomSizeSqFt;
        this.amenityIds = amenityIds;
        this.isActive = isActive;
        this.active = active;
    }

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

    public Integer getAdultCapacity() { return adultCapacity; }
    public void setAdultCapacity(Integer adultCapacity) { this.adultCapacity = adultCapacity; }

    public Integer getMaximumAdults() { return maximumAdults; }
    public void setMaximumAdults(Integer maximumAdults) { this.maximumAdults = maximumAdults; }

    public Integer getChildCapacity() { return childCapacity; }
    public void setChildCapacity(Integer childCapacity) { this.childCapacity = childCapacity; }

    public Integer getMaximumChildren() { return maximumChildren; }
    public void setMaximumChildren(Integer maximumChildren) { this.maximumChildren = maximumChildren; }

    public String getBedType() { return bedType; }
    public void setBedType(String bedType) { this.bedType = bedType; }

    public Integer getRoomSizeSqFt() { return roomSizeSqFt; }
    public void setRoomSizeSqFt(Integer roomSizeSqFt) { this.roomSizeSqFt = roomSizeSqFt; }

    public List<Long> getAmenityIds() { return amenityIds; }
    public void setAmenityIds(List<Long> amenityIds) { this.amenityIds = amenityIds; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
