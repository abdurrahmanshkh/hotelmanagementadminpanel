package com.smartstay.dto.room;

import com.smartstay.enums.RoomStatus;

import java.util.List;

public class RoomFormValueDto {
    private String roomNumber;
    private Long roomTypeId;
    private Integer floor;
    private Integer floorNumber;
    private String description;
    private Boolean isActive;
    private Boolean active;
    private RoomStatus status;
    private List<String> imageUrls;

    public RoomFormValueDto() {
    }

    public RoomFormValueDto(String roomNumber, Long roomTypeId, Integer floor, Integer floorNumber, String description, Boolean isActive, Boolean active, RoomStatus status, List<String> imageUrls) {
        this.roomNumber = roomNumber;
        this.roomTypeId = roomTypeId;
        this.floor = floor;
        this.floorNumber = floorNumber;
        this.description = description;
        this.isActive = isActive;
        this.active = active;
        this.status = status;
        this.imageUrls = imageUrls;
    }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public Long getRoomTypeId() { return roomTypeId; }
    public void setRoomTypeId(Long roomTypeId) { this.roomTypeId = roomTypeId; }

    public Integer getFloor() { return floor; }
    public void setFloor(Integer floor) { this.floor = floor; }

    public Integer getFloorNumber() { return floorNumber; }
    public void setFloorNumber(Integer floorNumber) { this.floorNumber = floorNumber; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public RoomStatus getStatus() { return status; }
    public void setStatus(RoomStatus status) { this.status = status; }

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
}
