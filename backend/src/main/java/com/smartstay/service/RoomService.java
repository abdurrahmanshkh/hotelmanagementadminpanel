package com.smartstay.service;

import com.smartstay.dto.common.PageData;
import com.smartstay.dto.room.*;
import com.smartstay.enums.BookingStatus;
import com.smartstay.enums.RoomStatus;
import com.smartstay.exception.ConflictException;
import com.smartstay.exception.ResourceNotFoundException;
import com.smartstay.model.Amenity;
import com.smartstay.model.Room;
import com.smartstay.model.RoomImage;
import com.smartstay.model.RoomType;
import com.smartstay.repository.AmenityRepository;
import com.smartstay.repository.BookingRepository;
import com.smartstay.repository.RoomImageRepository;
import com.smartstay.repository.RoomRepository;
import com.smartstay.repository.RoomTypeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.smartstay.enums.CleaningTaskStatus;
import com.smartstay.enums.MaintenanceStatus;
import com.smartstay.enums.Priority;
import com.smartstay.model.CleaningTask;
import com.smartstay.model.MaintenanceRecord;
import com.smartstay.repository.CleaningTaskRepository;
import com.smartstay.repository.MaintenanceRecordRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final AmenityRepository amenityRepository;
    private final RoomImageRepository roomImageRepository;
    private final BookingRepository bookingRepository;
    private final CleaningTaskRepository cleaningTaskRepository;
    private final MaintenanceRecordRepository maintenanceRecordRepository;

    public RoomService(
            RoomRepository roomRepository,
            RoomTypeRepository roomTypeRepository,
            AmenityRepository amenityRepository,
            RoomImageRepository roomImageRepository,
            BookingRepository bookingRepository,
            CleaningTaskRepository cleaningTaskRepository,
            MaintenanceRecordRepository maintenanceRecordRepository
    ) {
        this.roomRepository = roomRepository;
        this.roomTypeRepository = roomTypeRepository;
        this.amenityRepository = amenityRepository;
        this.roomImageRepository = roomImageRepository;
        this.bookingRepository = bookingRepository;
        this.cleaningTaskRepository = cleaningTaskRepository;
        this.maintenanceRecordRepository = maintenanceRecordRepository;
    }

    @Transactional(readOnly = true)
    public List<RoomDto> getAllActiveRooms() {
        return roomRepository.findByActiveTrue().stream()
                .map(r -> RoomDto.fromEntity(r, r.getRoomType().getBasePrice()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RoomDto> getFeaturedRooms() {
        return roomRepository.findByFeaturedTrueAndActiveTrue().stream()
                .map(r -> RoomDto.fromEntity(r, r.getRoomType().getBasePrice()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RoomDto getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));
        return RoomDto.fromEntity(room, room.getRoomType().getBasePrice());
    }

    @Transactional(readOnly = true)
    public RoomDto getRoomByPublicIdOrNumber(String identifier) {
        Room room = roomRepository.findByPublicId(identifier)
                .or(() -> roomRepository.findByRoomNumber(identifier))
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with identifier: " + identifier));
        return RoomDto.fromEntity(room, room.getRoomType().getBasePrice());
    }

    @Transactional(readOnly = true)
    public PageData<RoomDto> searchRooms(
            String query, Long roomTypeId, Integer floor, RoomStatus status,
            BigDecimal minPrice, BigDecimal maxPrice, Integer adults, String bedType,
            int page, int size, String sortBy
    ) {
        Sort sort = Sort.by(Sort.Direction.ASC, "roomNumber");
        if ("PRICE_LOW".equalsIgnoreCase(sortBy) || "price_asc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "roomType.basePrice");
        } else if ("PRICE_HIGH".equalsIgnoreCase(sortBy) || "price_desc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "roomType.basePrice");
        } else if ("RATING".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "rating");
        } else if ("CAPACITY".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "roomType.maximumAdults");
        } else if ("RECOMMENDED".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "featured").and(Sort.by(Sort.Direction.ASC, "roomNumber"));
        }

        int pageNum = Math.max(0, page - 1);
        Pageable pageable = PageRequest.of(pageNum, size, sort);
        Page<Room> roomPage = roomRepository.searchRooms(query, roomTypeId, floor, status, minPrice, maxPrice, adults, bedType, pageable);
        List<RoomDto> dtos = roomPage.getContent().stream()
                .map(r -> RoomDto.fromEntity(r, r.getRoomType().getBasePrice()))
                .collect(Collectors.toList());

        return PageData.of(dtos, roomPage.getNumber() + 1, roomPage.getSize(), roomPage.getTotalElements());
    }

    @Transactional(readOnly = true)
    public List<RoomAvailabilityResultDto> checkAvailability(
            String checkInDateStr, String checkOutDateStr, int adults, int children, Long roomTypeId
    ) {
        LocalDate checkIn = LocalDate.parse(checkInDateStr);
        LocalDate checkOut = LocalDate.parse(checkOutDateStr);
        long nights = Math.max(1, ChronoUnit.DAYS.between(checkIn, checkOut));

        List<Room> candidates;
        if (roomTypeId != null) {
            candidates = roomRepository.findByRoomTypeIdAndActiveTrue(roomTypeId);
        } else {
            candidates = roomRepository.findByActiveTrue();
        }

        List<RoomStatus> activeStatuses = List.of(BookingStatus.PENDING_PAYMENT, BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN)
                .stream().map(s -> RoomStatus.RESERVED).collect(Collectors.toList());

        List<RoomAvailabilityResultDto> results = new ArrayList<>();
        for (Room room : candidates) {
            RoomType rt = room.getRoomType();
            if (rt.getMaximumAdults() < adults) continue;

            // Check overlap with active bookings
            long overlapCount = bookingRepository.countOverlappingBookings(
                    room.getId(), checkIn, checkOut,
                    List.of(BookingStatus.PENDING_PAYMENT, BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN)
            );

            boolean isAvailable = (overlapCount == 0) && (room.getStatus() == RoomStatus.AVAILABLE || room.getStatus() == RoomStatus.RESERVED);
            BigDecimal nightlyPrice = rt.getBasePrice();
            BigDecimal totalStayPrice = nightlyPrice.multiply(BigDecimal.valueOf(nights));

            results.add(RoomAvailabilityResultDto.builder()
                    .room(RoomDto.fromEntity(room, nightlyPrice))
                    .available(isAvailable)
                    .nightlyPrice(nightlyPrice)
                    .totalPriceForStay(totalStayPrice)
                    .build());
        }

        return results;
    }

    @Transactional(readOnly = true)
    public List<RoomTypeDto> getAllRoomTypes() {
        return roomTypeRepository.findAll().stream()
                .map(RoomTypeDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RoomTypeDto getRoomTypeById(Long id) {
        RoomType rt = roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found with ID: " + id));
        return RoomTypeDto.fromEntity(rt);
    }

    @Transactional
    public RoomTypeDto createRoomType(RoomTypeFormValueDto form) {
        if (roomTypeRepository.findByCode(form.getCode()).isPresent()) {
            throw new ConflictException("Room type code already exists: " + form.getCode());
        }

        RoomType rt = RoomType.builder()
                .name(form.getName())
                .code(form.getCode().toUpperCase())
                .description(form.getDescription())
                .basePrice(form.getBasePrice())
                .minimumPrice(form.getMinimumPrice() != null ? form.getMinimumPrice() : form.getBasePrice().multiply(BigDecimal.valueOf(0.7)))
                .maximumPrice(form.getMaximumPrice() != null ? form.getMaximumPrice() : form.getBasePrice().multiply(BigDecimal.valueOf(1.5)))
                .maximumAdults(form.getMaximumAdults() != null ? form.getMaximumAdults() : (form.getAdultCapacity() != null ? form.getAdultCapacity() : 2))
                .maximumChildren(form.getMaximumChildren() != null ? form.getMaximumChildren() : (form.getChildCapacity() != null ? form.getChildCapacity() : 1))
                .bedType(form.getBedType())
                .roomSizeSqft(form.getRoomSizeSqFt())
                .active(form.getIsActive() != null ? form.getIsActive() : true)
                .build();

        if (form.getAmenityIds() != null && !form.getAmenityIds().isEmpty()) {
            Set<Amenity> amenities = new HashSet<>(amenityRepository.findAllById(form.getAmenityIds()));
            rt.setAmenities(amenities);
        }

        rt = roomTypeRepository.save(rt);
        return RoomTypeDto.fromEntity(rt);
    }

    @Transactional
    public RoomTypeDto updateRoomType(Long id, RoomTypeFormValueDto form) {
        RoomType rt = roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found with ID: " + id));

        if (form.getName() != null) rt.setName(form.getName());
        if (form.getDescription() != null) rt.setDescription(form.getDescription());
        if (form.getBasePrice() != null) rt.setBasePrice(form.getBasePrice());
        if (form.getMinimumPrice() != null) rt.setMinimumPrice(form.getMinimumPrice());
        if (form.getMaximumPrice() != null) rt.setMaximumPrice(form.getMaximumPrice());
        if (form.getMaximumAdults() != null) rt.setMaximumAdults(form.getMaximumAdults());
        else if (form.getAdultCapacity() != null) rt.setMaximumAdults(form.getAdultCapacity());
        if (form.getMaximumChildren() != null) rt.setMaximumChildren(form.getMaximumChildren());
        else if (form.getChildCapacity() != null) rt.setMaximumChildren(form.getChildCapacity());
        if (form.getBedType() != null) rt.setBedType(form.getBedType());
        if (form.getRoomSizeSqFt() != null) rt.setRoomSizeSqft(form.getRoomSizeSqFt());
        if (form.getIsActive() != null) rt.setActive(form.getIsActive());

        if (form.getAmenityIds() != null) {
            Set<Amenity> amenities = new HashSet<>(amenityRepository.findAllById(form.getAmenityIds()));
            rt.setAmenities(amenities);
        }

        rt = roomTypeRepository.save(rt);
        return RoomTypeDto.fromEntity(rt);
    }

    @Transactional
    public RoomDto createRoom(RoomFormValueDto form) {
        if (roomRepository.findByRoomNumber(form.getRoomNumber()).isPresent()) {
            throw new ConflictException("Room number already exists: " + form.getRoomNumber());
        }

        RoomType roomType = roomTypeRepository.findById(form.getRoomTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found with ID: " + form.getRoomTypeId()));

        int floorNum = form.getFloorNumber() != null ? form.getFloorNumber() : (form.getFloor() != null ? form.getFloor() : 1);
        String publicId = "RM-" + form.getRoomNumber();

        Room room = Room.builder()
                .publicId(publicId)
                .roomNumber(form.getRoomNumber())
                .roomType(roomType)
                .floorNumber(floorNum)
                .status(form.getStatus() != null ? form.getStatus() : RoomStatus.AVAILABLE)
                .description(form.getDescription())
                .active(form.getIsActive() != null ? form.getIsActive() : (form.getActive() != null ? form.getActive() : true))
                .featured(false)
                .build();

        room = roomRepository.save(room);

        if (form.getImageUrls() != null && !form.getImageUrls().isEmpty()) {
            int order = 1;
            for (String url : form.getImageUrls()) {
                RoomImage img = RoomImage.builder()
                        .room(room)
                        .roomType(roomType)
                        .imageUrl(url)
                        .altText("Room " + room.getRoomNumber())
                        .displayOrder(order++)
                        .active(true)
                        .build();
                roomImageRepository.save(img);
            }
        }

        syncRoomStatusTasks(room);
        return RoomDto.fromEntity(room, roomType.getBasePrice());
    }

    @Transactional
    public RoomDto updateRoom(Long id, RoomFormValueDto form) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));

        if (form.getRoomNumber() != null) room.setRoomNumber(form.getRoomNumber());
        if (form.getRoomTypeId() != null) {
            RoomType rt = roomTypeRepository.findById(form.getRoomTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Room type not found with ID: " + form.getRoomTypeId()));
            room.setRoomType(rt);
        }
        if (form.getFloorNumber() != null) room.setFloorNumber(form.getFloorNumber());
        else if (form.getFloor() != null) room.setFloorNumber(form.getFloor());
        if (form.getDescription() != null) room.setDescription(form.getDescription());
        if (form.getStatus() != null) room.setStatus(form.getStatus());
        if (form.getIsActive() != null) room.setActive(form.getIsActive());

        room = roomRepository.save(room);
        syncRoomStatusTasks(room);
        return RoomDto.fromEntity(room, room.getRoomType().getBasePrice());
    }

    @Transactional
    public RoomDto updateRoomStatus(Long id, RoomStatus status) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));
        room.setStatus(status);
        room = roomRepository.save(room);
        syncRoomStatusTasks(room);
        return RoomDto.fromEntity(room, room.getRoomType().getBasePrice());
    }

    private void syncRoomStatusTasks(Room room) {
        if (room.getStatus() == RoomStatus.UNDER_CLEANING) {
            String taskRef = "CLN-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            CleaningTask task = CleaningTask.builder()
                    .taskNumber(taskRef)
                    .room(room)
                    .status(CleaningTaskStatus.PENDING)
                    .notes("Generated automatically for room " + room.getRoomNumber())
                    .build();
            cleaningTaskRepository.save(task);
        } else if (room.getStatus() == RoomStatus.MAINTENANCE) {
            String recordRef = "MNT-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            MaintenanceRecord record = MaintenanceRecord.builder()
                    .recordNumber(recordRef)
                    .room(room)
                    .title("Routine Maintenance for Room " + room.getRoomNumber())
                    .description("Generated automatically for room " + room.getRoomNumber())
                    .priority(Priority.MEDIUM)
                    .status(MaintenanceStatus.OPEN)
                    .build();
            maintenanceRecordRepository.save(record);
        }
    }

    @Transactional(readOnly = true)
    public List<AmenityDto> getAllAmenities() {
        return amenityRepository.findAll().stream()
                .map(AmenityDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public AmenityDto createAmenity(String name, String iconName) {
        if (amenityRepository.findByName(name).isPresent()) {
            throw new ConflictException("Amenity already exists with name: " + name);
        }
        Amenity amenity = Amenity.builder()
                .name(name)
                .iconName(iconName != null ? iconName : "check")
                .active(true)
                .build();
        amenity = amenityRepository.save(amenity);
        return AmenityDto.fromEntity(amenity);
    }
}
