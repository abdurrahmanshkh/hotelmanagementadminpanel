package com.smartstay.model;

import jakarta.persistence.*;

@Entity
@Table(name = "room_images")
public class RoomImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type_id")
    private RoomType roomType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "alt_text")
    private String altText;

    @Column(name = "display_order")
    private Integer displayOrder = 1;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    public RoomImage() {
    }

    public RoomImage(Long id, RoomType roomType, Room room, String imageUrl, String altText, Integer displayOrder, Boolean active) {
        this.id = id;
        this.roomType = roomType;
        this.room = room;
        this.imageUrl = imageUrl;
        this.altText = altText;
        this.displayOrder = displayOrder != null ? displayOrder : 1;
        this.active = active != null ? active : true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public RoomType getRoomType() { return roomType; }
    public void setRoomType(RoomType roomType) { this.roomType = roomType; }

    public Room getRoom() { return room; }
    public void setRoom(Room room) { this.room = room; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getAltText() { return altText; }
    public void setAltText(String altText) { this.altText = altText; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public static RoomImageBuilder builder() {
        return new RoomImageBuilder();
    }

    public static class RoomImageBuilder {
        private Long id;
        private RoomType roomType;
        private Room room;
        private String imageUrl;
        private String altText;
        private Integer displayOrder = 1;
        private Boolean active = true;

        public RoomImageBuilder id(Long id) { this.id = id; return this; }
        public RoomImageBuilder roomType(RoomType roomType) { this.roomType = roomType; return this; }
        public RoomImageBuilder room(Room room) { this.room = room; return this; }
        public RoomImageBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public RoomImageBuilder altText(String altText) { this.altText = altText; return this; }
        public RoomImageBuilder displayOrder(Integer displayOrder) { this.displayOrder = displayOrder; return this; }
        public RoomImageBuilder active(Boolean active) { this.active = active; return this; }

        public RoomImage build() {
            return new RoomImage(id, roomType, room, imageUrl, altText, displayOrder, active);
        }
    }
}
