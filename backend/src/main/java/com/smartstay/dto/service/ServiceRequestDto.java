package com.smartstay.dto.service;

import com.smartstay.enums.Priority;
import com.smartstay.enums.ServiceRequestStatus;
import com.smartstay.model.ServiceRequestEntity;

import java.time.format.DateTimeFormatter;

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

    public ServiceRequestDto() {
    }

    public ServiceRequestDto(Long id, String referenceNumber, Long bookingId, String bookingReference, Long roomId, String roomNumber, Long guestId, Long userId, String guestName, String category, String title, String description, Priority priority, ServiceRequestStatus status, Long assignedStaffId, String assignedStaffName, String notes, String requestedAt, String acceptedAt, String startedAt, String completedAt, String createdAt, String updatedAt) {
        this.id = id;
        this.referenceNumber = referenceNumber;
        this.bookingId = bookingId;
        this.bookingReference = bookingReference;
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.guestId = guestId;
        this.userId = userId;
        this.guestName = guestName;
        this.category = category;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.assignedStaffId = assignedStaffId;
        this.assignedStaffName = assignedStaffName;
        this.notes = notes;
        this.requestedAt = requestedAt;
        this.acceptedAt = acceptedAt;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReferenceNumber() { return referenceNumber; }
    public void setReferenceNumber(String referenceNumber) { this.referenceNumber = referenceNumber; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public Long getGuestId() { return guestId; }
    public void setGuestId(Long guestId) { this.guestId = guestId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getGuestName() { return guestName; }
    public void setGuestName(String guestName) { this.guestName = guestName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public ServiceRequestStatus getStatus() { return status; }
    public void setStatus(ServiceRequestStatus status) { this.status = status; }

    public Long getAssignedStaffId() { return assignedStaffId; }
    public void setAssignedStaffId(Long assignedStaffId) { this.assignedStaffId = assignedStaffId; }

    public String getAssignedStaffName() { return assignedStaffName; }
    public void setAssignedStaffName(String assignedStaffName) { this.assignedStaffName = assignedStaffName; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getRequestedAt() { return requestedAt; }
    public void setRequestedAt(String requestedAt) { this.requestedAt = requestedAt; }

    public String getAcceptedAt() { return acceptedAt; }
    public void setAcceptedAt(String acceptedAt) { this.acceptedAt = acceptedAt; }

    public String getStartedAt() { return startedAt; }
    public void setStartedAt(String startedAt) { this.startedAt = startedAt; }

    public String getCompletedAt() { return completedAt; }
    public void setCompletedAt(String completedAt) { this.completedAt = completedAt; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

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

    public static ServiceRequestDtoBuilder builder() {
        return new ServiceRequestDtoBuilder();
    }

    public static class ServiceRequestDtoBuilder {
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

        public ServiceRequestDtoBuilder id(Long id) { this.id = id; return this; }
        public ServiceRequestDtoBuilder referenceNumber(String referenceNumber) { this.referenceNumber = referenceNumber; return this; }
        public ServiceRequestDtoBuilder bookingId(Long bookingId) { this.bookingId = bookingId; return this; }
        public ServiceRequestDtoBuilder bookingReference(String bookingReference) { this.bookingReference = bookingReference; return this; }
        public ServiceRequestDtoBuilder roomId(Long roomId) { this.roomId = roomId; return this; }
        public ServiceRequestDtoBuilder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public ServiceRequestDtoBuilder guestId(Long guestId) { this.guestId = guestId; return this; }
        public ServiceRequestDtoBuilder userId(Long userId) { this.userId = userId; return this; }
        public ServiceRequestDtoBuilder guestName(String guestName) { this.guestName = guestName; return this; }
        public ServiceRequestDtoBuilder category(String category) { this.category = category; return this; }
        public ServiceRequestDtoBuilder title(String title) { this.title = title; return this; }
        public ServiceRequestDtoBuilder description(String description) { this.description = description; return this; }
        public ServiceRequestDtoBuilder priority(Priority priority) { this.priority = priority; return this; }
        public ServiceRequestDtoBuilder status(ServiceRequestStatus status) { this.status = status; return this; }
        public ServiceRequestDtoBuilder assignedStaffId(Long assignedStaffId) { this.assignedStaffId = assignedStaffId; return this; }
        public ServiceRequestDtoBuilder assignedStaffName(String assignedStaffName) { this.assignedStaffName = assignedStaffName; return this; }
        public ServiceRequestDtoBuilder notes(String notes) { this.notes = notes; return this; }
        public ServiceRequestDtoBuilder requestedAt(String requestedAt) { this.requestedAt = requestedAt; return this; }
        public ServiceRequestDtoBuilder acceptedAt(String acceptedAt) { this.acceptedAt = acceptedAt; return this; }
        public ServiceRequestDtoBuilder startedAt(String startedAt) { this.startedAt = startedAt; return this; }
        public ServiceRequestDtoBuilder completedAt(String completedAt) { this.completedAt = completedAt; return this; }
        public ServiceRequestDtoBuilder createdAt(String createdAt) { this.createdAt = createdAt; return this; }
        public ServiceRequestDtoBuilder updatedAt(String updatedAt) { this.updatedAt = updatedAt; return this; }

        public ServiceRequestDto build() {
            return new ServiceRequestDto(id, referenceNumber, bookingId, bookingReference, roomId, roomNumber, guestId, userId, guestName, category, title, description, priority, status, assignedStaffId, assignedStaffName, notes, requestedAt, acceptedAt, startedAt, completedAt, createdAt, updatedAt);
        }
    }
}
