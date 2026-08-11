package com.smartstay.service;

import com.smartstay.dto.common.PageData;
import com.smartstay.dto.service.CreateServiceRequestDto;
import com.smartstay.dto.service.ServiceRequestDto;
import com.smartstay.enums.Priority;
import com.smartstay.enums.ServiceRequestStatus;
import com.smartstay.exception.BusinessRuleException;
import com.smartstay.exception.ResourceNotFoundException;
import com.smartstay.model.Booking;
import com.smartstay.model.ServiceRequestEntity;
import com.smartstay.model.User;
import com.smartstay.repository.BookingRepository;
import com.smartstay.repository.ServiceRequestRepository;
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
public class ServiceRequestManager {

    private final ServiceRequestRepository serviceRequestRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public ServiceRequestManager(
            ServiceRequestRepository serviceRequestRepository,
            BookingRepository bookingRepository,
            UserRepository userRepository
    ) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ServiceRequestDto createRequest(User user, CreateServiceRequestDto req) {
        Booking booking = null;
        if (req.getBookingId() != null) {
            booking = bookingRepository.findById(req.getBookingId()).orElse(null);
        }
        if (booking == null) {
            List<Booking> userBookings = bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
            if (!userBookings.isEmpty()) {
                booking = userBookings.get(0);
            }
        }

        String refCode = "SRV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        ServiceRequestEntity request = ServiceRequestEntity.builder()
                .requestReference(refCode)
                .user(user)
                .booking(booking)
                .room(booking != null ? booking.getRoom() : null)
                .category(req.getCategory())
                .title(req.getTitle())
                .description(req.getDescription())
                .priority(req.getPriority() != null ? req.getPriority() : Priority.MEDIUM)
                .status(ServiceRequestStatus.PENDING)
                .build();

        request = serviceRequestRepository.save(request);
        return ServiceRequestDto.fromEntity(request);
    }

    @Transactional(readOnly = true)
    public List<ServiceRequestDto> getCustomerRequests(Long userId) {
        return serviceRequestRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(ServiceRequestDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PageData<ServiceRequestDto> searchRequests(
            String query, String category, Priority priority, ServiceRequestStatus status,
            String roomNumber, Boolean unassignedOnly, int page, int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ServiceRequestEntity> requestPage = serviceRequestRepository.searchRequests(
                query, category, priority, status, roomNumber, unassignedOnly, pageable
        );

        List<ServiceRequestDto> dtos = requestPage.getContent().stream()
                .map(ServiceRequestDto::fromEntity)
                .collect(Collectors.toList());

        return PageData.of(dtos, requestPage.getNumber(), requestPage.getSize(), requestPage.getTotalElements());
    }

    @Transactional
    public ServiceRequestDto assignStaff(Long requestId, Long staffId, String staffName) {
        ServiceRequestEntity request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found with ID: " + requestId));

        if (staffId != null) {
            User staff = userRepository.findById(staffId)
                    .orElseThrow(() -> new ResourceNotFoundException("Staff user not found with ID: " + staffId));
            request.setAssignedTo(staff);
        }

        if (request.getStatus() == ServiceRequestStatus.PENDING) {
            request.setStatus(ServiceRequestStatus.ACCEPTED);
            request.setAcceptedAt(LocalDateTime.now());
        }

        request = serviceRequestRepository.save(request);
        return ServiceRequestDto.fromEntity(request);
    }

    @Transactional
    public ServiceRequestDto updateStatus(Long requestId, ServiceRequestStatus status, String notes) {
        ServiceRequestEntity request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found with ID: " + requestId));

        request.setStatus(status);
        if (notes != null) request.setNotes(notes);

        LocalDateTime now = LocalDateTime.now();
        if (status == ServiceRequestStatus.IN_PROGRESS && request.getStartedAt() == null) {
            request.setStartedAt(now);
        } else if (status == ServiceRequestStatus.COMPLETED) {
            request.setCompletedAt(now);
        }

        request = serviceRequestRepository.save(request);
        return ServiceRequestDto.fromEntity(request);
    }

    @Transactional
    public ServiceRequestDto cancelRequest(Long requestId, Long userId) {
        ServiceRequestEntity request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found with ID: " + requestId));

        if (userId != null && !request.getUser().getId().equals(userId)) {
            throw new BusinessRuleException("Unauthorized to cancel this service request");
        }

        request.setStatus(ServiceRequestStatus.CANCELLED);
        request = serviceRequestRepository.save(request);
        return ServiceRequestDto.fromEntity(request);
    }
}
