package com.smartstay.dto.service;

import com.smartstay.enums.Priority;
import com.smartstay.enums.ServiceRequestStatus;
import com.smartstay.model.ServiceRequestEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRequestDto {

    private Long id;
    private String referenceNumber;
    private Long bookingId;
    private String bookingReference;
    private Long roomId;
    private String roomNumber;
    private Long guestId;
    private Long userId;
    private String guestName;
    private String category;
    private String title;
    private String description;
    private Priority priority;
    private ServiceRequestStatus status;
    private Long assignedStaffId;
    private String assignedStaffName;
    private String notes;
    private String requestedAt;
    private String acceptedAt;
    private String startedAt;
    private String completedAt;
    private String createdAt;
    private String updatedAt;

    public static ServiceRequestDto fromEntity(ServiceRequestEntity s) {
        if (s == null) return null;

        String gName = s.getUser() != null ? s.getUser().getFullName() : "Guest";
        String rNum = s.getRoom() != null ? s.getRoom().getRoomNumber() : "";
        String bRef = s.getBooking() != null ? s.getBooking().getBookingReference() : "";
        String staffName = s.getAssignedTo() != null ? s.getAssignedTo().getFullName() : null;

        return ServiceRequestDto.builder()
                .id(s.getId())
                .referenceNumber(s.getRequestReference())
                .bookingId(s.getBooking() != null ? s.getBooking().getId() : null)
                .bookingReference(bRef)
                .roomId(s.getRoom() != null ? s.getRoom().getId() : null)
                .roomNumber(rNum)
                .guestId(s.getUser() != null ? s.getUser().getId() : null)
                .userId(s.getUser() != null ? s.getUser().getId() : null)
                .guestName(gName)
                .category(s.getCategory())
                .title(s.getTitle())
                .description(s.getDescription())
                .priority(s.getPriority())
                .status(s.getStatus())
                .assignedStaffId(s.getAssignedTo() != null ? s.getAssignedTo().getId() : null)
                .assignedStaffName(staffName)
                .notes(s.getNotes())
                .requestedAt(s.getCreatedAt() != null ? s.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .acceptedAt(s.getAcceptedAt() != null ? s.getAcceptedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .startedAt(s.getStartedAt() != null ? s.getStartedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .completedAt(s.getCompletedAt() != null ? s.getCompletedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .createdAt(s.getCreatedAt() != null ? s.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .updatedAt(s.getUpdatedAt() != null ? s.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .build();
    }
}
