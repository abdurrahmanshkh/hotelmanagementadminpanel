package com.smartstay.service;

import com.smartstay.dto.cleaning.CleaningTaskDto;
import com.smartstay.dto.cleaning.CompleteCleaningRequestDto;
import com.smartstay.dto.common.PageData;
import com.smartstay.enums.CleaningTaskStatus;
import com.smartstay.enums.RoomStatus;
import com.smartstay.exception.ResourceNotFoundException;
import com.smartstay.model.CleaningTask;
import com.smartstay.model.Room;
import com.smartstay.model.User;
import com.smartstay.repository.CleaningTaskRepository;
import com.smartstay.repository.RoomRepository;
import com.smartstay.repository.UserRepository;
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
public class CleaningService {

    private final CleaningTaskRepository cleaningTaskRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public CleaningService(
            CleaningTaskRepository cleaningTaskRepository,
            RoomRepository roomRepository,
            UserRepository userRepository
    ) {
        this.cleaningTaskRepository = cleaningTaskRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public PageData<CleaningTaskDto> searchCleaningTasks(
            String roomNumber, CleaningTaskStatus status, Long assignedStaffId, int page, int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<CleaningTask> taskPage = cleaningTaskRepository.searchCleaningTasks(roomNumber, status, assignedStaffId, pageable);

        List<CleaningTaskDto> dtos = taskPage.getContent().stream()
                .map(CleaningTaskDto::fromEntity)
                .collect(Collectors.toList());

        return PageData.of(dtos, taskPage.getNumber(), taskPage.getSize(), taskPage.getTotalElements());
    }

    @Transactional
    public CleaningTaskDto createCleaningTask(Long roomId, String notes) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + roomId));

        String taskNum = "CLN-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        CleaningTask task = CleaningTask.builder()
                .taskNumber(taskNum)
                .room(room)
                .status(CleaningTaskStatus.PENDING)
                .notes(notes)
                .build();

        room.setStatus(RoomStatus.UNDER_CLEANING);
        roomRepository.save(room);

        task = cleaningTaskRepository.save(task);
        return CleaningTaskDto.fromEntity(task);
    }

    @Transactional
    public CleaningTaskDto assignStaff(Long taskId, Long staffId, String staffName) {
        CleaningTask task = cleaningTaskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Cleaning task not found with ID: " + taskId));

        if (staffId != null) {
            User staff = userRepository.findById(staffId)
                    .orElseThrow(() -> new ResourceNotFoundException("Staff user not found with ID: " + staffId));
            task.setAssignedStaff(staff);
        }

        task.setStatus(CleaningTaskStatus.ASSIGNED);
        task.setAssignedAt(LocalDateTime.now());
        task = cleaningTaskRepository.save(task);
        return CleaningTaskDto.fromEntity(task);
    }

    @Transactional
    public CleaningTaskDto startTask(Long taskId) {
        CleaningTask task = cleaningTaskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Cleaning task not found with ID: " + taskId));

        task.setStatus(CleaningTaskStatus.IN_PROGRESS);
        task.setStartedAt(LocalDateTime.now());
        task = cleaningTaskRepository.save(task);
        return CleaningTaskDto.fromEntity(task);
    }

    @Transactional
    public CleaningTaskDto completeTask(Long taskId, CompleteCleaningRequestDto req) {
        CleaningTask task = cleaningTaskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Cleaning task not found with ID: " + taskId));

        task.setStatus(CleaningTaskStatus.COMPLETED);
        task.setCompletedAt(LocalDateTime.now());
        if (req != null && req.getNotes() != null) task.setNotes(req.getNotes());

        Room room = task.getRoom();
        if (req != null && req.isMaintenanceIssueFound()) {
            task.setMaintenanceIssueFound(true);
            room.setStatus(RoomStatus.MAINTENANCE);
        } else {
            room.setStatus(RoomStatus.AVAILABLE);
        }
        roomRepository.save(room);

        task = cleaningTaskRepository.save(task);
        return CleaningTaskDto.fromEntity(task);
    }
}
