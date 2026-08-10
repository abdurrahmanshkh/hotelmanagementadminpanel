package com.smartstay.dto.room;

import com.smartstay.enums.RoomStatus;
import lombok.Data;

import java.util.List;

@Data
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
}
