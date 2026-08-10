package com.smartstay.dto.room;

import com.smartstay.enums.RoomStatus;
import com.smartstay.model.Room;

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
}
