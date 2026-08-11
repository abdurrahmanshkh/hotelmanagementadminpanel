package com.smartstay.dto.room;

import com.smartstay.model.RoomImage;

public class RoomImageDto {
    private Long id;
    private String url;
    private String altText;
    private int displayOrder;

    public RoomImageDto() {
    }

    public RoomImageDto(Long id, String url, String altText, int displayOrder) {
        this.id = id;
        this.url = url;
        this.altText = altText;
        this.displayOrder = displayOrder;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getAltText() { return altText; }
    public void setAltText(String altText) { this.altText = altText; }

    public int getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }

    public static RoomImageDto fromEntity(RoomImage image) {
        if (image == null) return null;
        return RoomImageDto.builder()
                .id(image.getId())
                .url(image.getImageUrl())
                .altText(image.getAltText())
                .displayOrder(image.getDisplayOrder() != null ? image.getDisplayOrder() : 1)
                .build();
    }

    public static RoomImageDtoBuilder builder() {
        return new RoomImageDtoBuilder();
    }

    public static class RoomImageDtoBuilder {
        private Long id;
        private String url;
        private String altText;
        private int displayOrder;

        public RoomImageDtoBuilder id(Long id) { this.id = id; return this; }
        public RoomImageDtoBuilder url(String url) { this.url = url; return this; }
        public RoomImageDtoBuilder altText(String altText) { this.altText = altText; return this; }
        public RoomImageDtoBuilder displayOrder(int displayOrder) { this.displayOrder = displayOrder; return this; }

        public RoomImageDto build() {
            return new RoomImageDto(id, url, altText, displayOrder);
        }
    }
}
