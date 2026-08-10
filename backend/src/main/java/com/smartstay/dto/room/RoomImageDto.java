package com.smartstay.dto.room;

import com.smartstay.model.RoomImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomImageDto {
    private Long id;
    private String url;
    private String altText;
    private int displayOrder;

    public static RoomImageDto fromEntity(RoomImage image) {
        if (image == null) return null;
        return RoomImageDto.builder()
                .id(image.getId())
                .url(image.getImageUrl())
                .altText(image.getAltText())
                .displayOrder(image.getDisplayOrder() != null ? image.getDisplayOrder() : 1)
                .build();
    }
}
