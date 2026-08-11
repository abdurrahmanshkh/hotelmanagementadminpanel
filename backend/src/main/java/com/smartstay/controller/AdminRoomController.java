package com.smartstay.controller;

import com.smartstay.dto.common.ApiResponse;
import com.smartstay.dto.common.PageData;
import com.smartstay.dto.room.*;
import com.smartstay.enums.RoomStatus;
import com.smartstay.service.RoomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminRoomController {

    private final RoomService roomService;

    public AdminRoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/rooms")
    public ResponseEntity<ApiResponse<PageData<RoomDto>>> getRooms(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long roomTypeId,
            @RequestParam(required = false) Integer floor,
            @RequestParam(required = false) RoomStatus status,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy
    ) {
        PageData<RoomDto> roomPage = roomService.searchRooms(
                query, roomTypeId, floor, status, minPrice, maxPrice, null, null, page, size, sortBy
        );
        return ResponseEntity.ok(ApiResponse.ok("Rooms retrieved successfully", roomPage));
    }

    @GetMapping("/rooms/{id}")
    public ResponseEntity<ApiResponse<RoomDto>> getRoomById(@PathVariable Long id) {
        RoomDto room = roomService.getRoomById(id);
        return ResponseEntity.ok(ApiResponse.ok("Room details retrieved", room));
    }

    @PostMapping("/rooms")
    public ResponseEntity<ApiResponse<RoomDto>> createRoom(@RequestBody RoomFormValueDto form) {
        RoomDto created = roomService.createRoom(form);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Room created successfully", created));
    }

    @PutMapping("/rooms/{id}")
    public ResponseEntity<ApiResponse<RoomDto>> updateRoom(
            @PathVariable Long id,
            @RequestBody RoomFormValueDto form
    ) {
        RoomDto updated = roomService.updateRoom(id, form);
        return ResponseEntity.ok(ApiResponse.ok("Room updated successfully", updated));
    }

    @PatchMapping("/rooms/{id}/status")
    public ResponseEntity<ApiResponse<RoomDto>> updateRoomStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String statusStr = body.get("status");
        RoomStatus status = RoomStatus.valueOf(statusStr.toUpperCase());
        RoomDto updated = roomService.updateRoomStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Room status updated successfully", updated));
    }

    @PostMapping("/room-types")
    public ResponseEntity<ApiResponse<RoomTypeDto>> createRoomType(@RequestBody RoomTypeFormValueDto form) {
        RoomTypeDto created = roomService.createRoomType(form);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Room type created successfully", created));
    }

    @PutMapping("/room-types/{id}")
    public ResponseEntity<ApiResponse<RoomTypeDto>> updateRoomType(
            @PathVariable Long id,
            @RequestBody RoomTypeFormValueDto form
    ) {
        RoomTypeDto updated = roomService.updateRoomType(id, form);
        return ResponseEntity.ok(ApiResponse.ok("Room type updated successfully", updated));
    }

    @GetMapping("/amenities")
    public ResponseEntity<ApiResponse<List<AmenityDto>>> getAmenities() {
        List<AmenityDto> amenities = roomService.getAllAmenities();
        return ResponseEntity.ok(ApiResponse.ok("Amenities retrieved successfully", amenities));
    }

    @PostMapping("/amenities")
    public ResponseEntity<ApiResponse<AmenityDto>> createAmenity(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String iconName = body.get("iconName");
        AmenityDto created = roomService.createAmenity(name, iconName);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Amenity created successfully", created));
    }
}
