package com.smartstay.service;

import com.smartstay.dto.common.PageData;
import com.smartstay.dto.cleaning.CleaningTaskDto;
import com.smartstay.dto.maintenance.*;
import com.smartstay.enums.CleaningTaskStatus;
import com.smartstay.enums.MaintenanceStatus;
import com.smartstay.enums.Priority;
import com.smartstay.enums.RoomStatus;
import com.smartstay.exception.ResourceNotFoundException;
import com.smartstay.model.CleaningTask;
import com.smartstay.model.MaintenanceRecord;
import com.smartstay.model.Room;
import com.smartstay.model.User;
import com.smartstay.repository.CleaningTaskRepository;
import com.smartstay.repository.MaintenanceRecordRepository;
import com.smartstay.repository.RoomRepository;
import com.smartstay.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaintenanceService {

    private final MaintenanceRecordRepository maintenanceRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final CleaningTaskRepository cleaningTaskRepository;

    @Transactional(readOnly = true)
    public PageData<MaintenanceRecordDto> searchRecords(
            String query, String roomNumber, Priority priority, MaintenanceStatus status, int page, int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<MaintenanceRecord> mPage = maintenanceRepository.searchMaintenanceRecords(query, roomNumber, priority, status, pageable);

        List<MaintenanceRecordDto> dtos = mPage.getContent().stream()
                .map(MaintenanceRecordDto::fromEntity)
                .collect(Collectors.toList());

        return PageData.of(dtos, mPage.getNumber(), mPage.getSize(), mPage.getTotalElements());
    }

    @Transactional
    public MaintenanceRecordDto createRecord(CreateMaintenanceRequestDto req, String reportedBy) {
        Room room = roomRepository.findById(req.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + req.getRoomId()));

        String recNum = "MNT-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        User tech = null;
        if (req.getAssignedTechnicianId() != null) {
            tech = userRepository.findById(req.getAssignedTechnicianId()).orElse(null);
        }

        MaintenanceRecord record = MaintenanceRecord.builder()
                .recordNumber(recNum)
                .room(room)
                .title(req.getTitle())
                .description(req.getDescription())
                .priority(req.getPriority() != null ? req.getPriority() : Priority.MEDIUM)
                .status(tech != null ? MaintenanceStatus.ASSIGNED : MaintenanceStatus.OPEN)
                .reportedBy(reportedBy != null ? reportedBy : "Admin Staff")
                .assignedTechnician(tech)
                .build();

        room.setStatus(RoomStatus.MAINTENANCE);
        roomRepository.save(room);

        record = maintenanceRepository.save(record);
        return MaintenanceRecordDto.fromEntity(record);
    }

    @Transactional
    public MaintenanceRecordDto assignTechnician(Long recordId, Long techId, String techName) {
        MaintenanceRecord record = maintenanceRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance record not found with ID: " + recordId));

        if (techId != null) {
            User tech = userRepository.findById(techId)
                    .orElseThrow(() -> new ResourceNotFoundException("Technician user not found with ID: " + techId));
            record.setAssignedTechnician(tech);
        }

        record.setStatus(MaintenanceStatus.ASSIGNED);
        record.setAssignedAt(LocalDateTime.now());
        record = maintenanceRepository.save(record);
        return MaintenanceRecordDto.fromEntity(record);
    }

    @Transactional
    public MaintenanceRecordDto startRecord(Long recordId) {
        MaintenanceRecord record = maintenanceRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance record not found with ID: " + recordId));

        record.setStatus(MaintenanceStatus.IN_PROGRESS);
        record.setStartedAt(LocalDateTime.now());
        record = maintenanceRepository.save(record);
        return MaintenanceRecordDto.fromEntity(record);
    }

    @Transactional
    public MaintenanceRecordDto holdRecord(Long recordId, String reason) {
        MaintenanceRecord record = maintenanceRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance record not found with ID: " + recordId));

        record.setStatus(MaintenanceStatus.ON_HOLD);
        record.setOnHoldAt(LocalDateTime.now());
        if (reason != null) record.setResolutionNotes("On Hold: " + reason);
        record = maintenanceRepository.save(record);
        return MaintenanceRecordDto.fromEntity(record);
    }

    @Transactional
    public MaintenanceRecordDto completeRecord(Long recordId, CompleteMaintenanceRequestDto req) {
        MaintenanceRecord record = maintenanceRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance record not found with ID: " + recordId));

        record.setStatus(MaintenanceStatus.COMPLETED);
        record.setCompletedAt(LocalDateTime.now());
        if (req != null && req.getResolutionNotes() != null) {
            record.setResolutionNotes(req.getResolutionNotes());
        }

        Room room = record.getRoom();
        if (req != null && req.isCleaningRequired()) {
            room.setStatus(RoomStatus.UNDER_CLEANING);
            String taskNum = "CLN-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            CleaningTask task = CleaningTask.builder()
                    .taskNumber(taskNum)
                    .room(room)
                    .status(CleaningTaskStatus.PENDING)
                    .notes("Generated after maintenance repair: " + record.getTitle())
                    .build();
            cleaningTaskRepository.save(task);
        } else {
            room.setStatus(RoomStatus.AVAILABLE);
        }
        roomRepository.save(room);

        record = maintenanceRepository.save(record);
        return MaintenanceRecordDto.fromEntity(record);
    }
}
