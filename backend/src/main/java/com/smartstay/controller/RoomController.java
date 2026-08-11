package com.smartstay.controller;

import com.smartstay.dto.common.ApiResponse;
import com.smartstay.dto.room.RoomAvailabilityResultDto;
import com.smartstay.dto.room.RoomDto;
import com.smartstay.dto.room.RoomTypeDto;
import com.smartstay.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/rooms")
    public ResponseEntity<ApiResponse<List<RoomDto>>> getRooms() {
        List<RoomDto> rooms = roomService.getAllActiveRooms();
        return ResponseEntity.ok(ApiResponse.ok("Rooms retrieved successfully", rooms));
    }

    @GetMapping("/rooms/featured")
    public ResponseEntity<ApiResponse<List<RoomDto>>> getFeaturedRooms() {
        List<RoomDto> rooms = roomService.getFeaturedRooms();
        return ResponseEntity.ok(ApiResponse.ok("Featured rooms retrieved successfully", rooms));
    }

    @GetMapping("/rooms/{id}")
    public ResponseEntity<ApiResponse<RoomDto>> getRoomById(@PathVariable String id) {
        RoomDto room;
        try {
            Long numericId = Long.parseLong(id);
            room = roomService.getRoomById(numericId);
        } catch (NumberFormatException e) {
            room = roomService.getRoomByPublicIdOrNumber(id);
        }
        return ResponseEntity.ok(ApiResponse.ok("Room details retrieved", room));
    }

    @GetMapping("/rooms/availability")
    public ResponseEntity<ApiResponse<List<RoomAvailabilityResultDto>>> checkAvailability(
            @RequestParam String checkInDate,
            @RequestParam String checkOutDate,
            @RequestParam(defaultValue = "1") int adults,
            @RequestParam(defaultValue = "0") int children,
            @RequestParam(required = false) Long roomTypeId
    ) {
        List<RoomAvailabilityResultDto> results = roomService.checkAvailability(
                checkInDate, checkOutDate, adults, children, roomTypeId
        );
        return ResponseEntity.ok(ApiResponse.ok("Room availability calculated", results));
    }

    @GetMapping("/room-types")
    public ResponseEntity<ApiResponse<List<RoomTypeDto>>> getRoomTypes() {
        List<RoomTypeDto> roomTypes = roomService.getAllRoomTypes();
        return ResponseEntity.ok(ApiResponse.ok("Room types retrieved successfully", roomTypes));
    }

    @GetMapping("/room-types/{id}")
    public ResponseEntity<ApiResponse<RoomTypeDto>> getRoomTypeById(@PathVariable Long id) {
        RoomTypeDto roomType = roomService.getRoomTypeById(id);
        return ResponseEntity.ok(ApiResponse.ok("Room type details retrieved", roomType));
    }
}
