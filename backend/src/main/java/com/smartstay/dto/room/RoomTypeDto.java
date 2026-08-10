package com.smartstay.dto.room;

import com.smartstay.model.RoomType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
}
