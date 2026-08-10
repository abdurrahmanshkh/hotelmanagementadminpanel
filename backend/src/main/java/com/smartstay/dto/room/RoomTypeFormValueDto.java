package com.smartstay.dto.room;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
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
}
