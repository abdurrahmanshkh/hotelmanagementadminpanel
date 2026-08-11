package com.smartstay.controller;

import com.smartstay.dto.common.ApiResponse;
import com.smartstay.dto.common.PageData;
import com.smartstay.dto.room.RoomAvailabilityResultDto;
import com.smartstay.dto.room.RoomDto;
import com.smartstay.dto.room.RoomTypeDto;
import com.smartstay.enums.RoomStatus;
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
    public ResponseEntity<ApiResponse<PageData<RoomDto>>> getRooms(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long roomTypeId,
            @RequestParam(required = false) Integer floor,
            @RequestParam(required = false) RoomStatus status,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer adults,
            @RequestParam(required = false) String bedType,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String sortBy
    ) {
        PageData<RoomDto> rooms = roomService.searchRooms(
                query, roomTypeId, floor, status, minPrice, maxPrice, adults, bedType, page, size, sortBy
        );
        return ResponseEntity.ok(ApiResponse.ok("Rooms retrieved successfully", rooms));
    }

    @GetMapping("/rooms/featured")
    public ResponseEntity<ApiResponse<List<RoomDto>>> getFeaturedRooms() {
        List<RoomDto> rooms = roomService.getFeaturedRooms();
        return ResponseEntity.ok(ApiResponse.ok("Featured rooms retrieved successfully", rooms));
    }

    @GetMapping({"/rooms/types", "/room-types"})
    public ResponseEntity<ApiResponse<List<RoomTypeDto>>> getRoomTypes() {
        List<RoomTypeDto> roomTypes = roomService.getAllRoomTypes();
        return ResponseEntity.ok(ApiResponse.ok("Room types retrieved successfully", roomTypes));
    }

    @GetMapping({"/rooms/types/{id}", "/room-types/{id}"})
    public ResponseEntity<ApiResponse<RoomTypeDto>> getRoomTypeById(@PathVariable Long id) {
        RoomTypeDto roomType = roomService.getRoomTypeById(id);
        return ResponseEntity.ok(ApiResponse.ok("Room type details retrieved", roomType));
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
}
