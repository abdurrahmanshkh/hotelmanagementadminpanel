package com.smartstay.dto.room;

import com.smartstay.model.Amenity;

public class AmenityDto {
    private Long id;
    private String name;
    private String iconName;
    private boolean active;

    public AmenityDto() {
    }

    public AmenityDto(Long id, String name, String iconName, boolean active) {
        this.id = id;
        this.name = name;
        this.iconName = iconName;
        this.active = active;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIconName() { return iconName; }
    public void setIconName(String iconName) { this.iconName = iconName; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public static AmenityDto fromEntity(Amenity amenity) {
        if (amenity == null) return null;
        return AmenityDto.builder()
                .id(amenity.getId())
                .name(amenity.getName())
                .iconName(amenity.getIconName())
                .active(Boolean.TRUE.equals(amenity.getActive()))
                .build();
    }

    public static AmenityDtoBuilder builder() {
        return new AmenityDtoBuilder();
    }

    public static class AmenityDtoBuilder {
        private Long id;
        private String name;
        private String iconName;
        private boolean active;

        public AmenityDtoBuilder id(Long id) { this.id = id; return this; }
        public AmenityDtoBuilder name(String name) { this.name = name; return this; }
        public AmenityDtoBuilder iconName(String iconName) { this.iconName = iconName; return this; }
        public AmenityDtoBuilder active(boolean active) { this.active = active; return this; }

        public AmenityDto build() {
            return new AmenityDto(id, name, iconName, active);
        }
    }
}
