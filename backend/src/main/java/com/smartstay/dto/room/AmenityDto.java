package com.smartstay.dto.room;

import com.smartstay.model.Amenity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AmenityDto {
    private Long id;
    private String name;
    private String iconName;
    private boolean active;

    public static AmenityDto fromEntity(Amenity amenity) {
        if (amenity == null) return null;
        return AmenityDto.builder()
                .id(amenity.getId())
                .name(amenity.getName())
                .iconName(amenity.getIconName())
                .active(Boolean.TRUE.equals(amenity.getActive()))
                .build();
    }
}
