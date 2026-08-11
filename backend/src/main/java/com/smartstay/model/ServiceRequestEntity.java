package com.smartstay.model;

import com.smartstay.enums.Priority;
import com.smartstay.enums.ServiceRequestStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "service_requests")
public class ServiceRequestEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_reference", nullable = false, unique = true)
    private String requestReference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private Priority priority = Priority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ServiceRequestStatus status = ServiceRequestStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @Column(name = "notes", length = 500)
    private String notes;

    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public ServiceRequestEntity() {
    }

    public ServiceRequestEntity(Long id, String requestReference, User user, Booking booking, Room room, String category, String title, String description, Priority priority, ServiceRequestStatus status, User assignedTo, String notes, LocalDateTime acceptedAt, LocalDateTime startedAt, LocalDateTime completedAt, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.requestReference = requestReference;
        this.user = user;
        this.booking = booking;
        this.room = room;
        this.category = category;
        this.title = title;
        this.description = description;
        this.priority = priority != null ? priority : Priority.MEDIUM;
        this.status = status != null ? status : ServiceRequestStatus.PENDING;
        this.assignedTo = assignedTo;
        this.notes = notes;
        this.acceptedAt = acceptedAt;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.priority == null) this.priority = Priority.MEDIUM;
        if (this.status == null) this.status = ServiceRequestStatus.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRequestReference() { return requestReference; }
    public void setRequestReference(String requestReference) { this.requestReference = requestReference; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public Room getRoom() { return room; }
    public void setRoom(Room room) { this.room = room; }

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

    public User getAssignedTo() { return assignedTo; }
    public void setAssignedTo(User assignedTo) { this.assignedTo = assignedTo; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getAcceptedAt() { return acceptedAt; }
    public void setAcceptedAt(LocalDateTime acceptedAt) { this.acceptedAt = acceptedAt; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static ServiceRequestEntityBuilder builder() {
        return new ServiceRequestEntityBuilder();
    }

    public static class ServiceRequestEntityBuilder {
        private Long id;
        private String requestReference;
        private User user;
        private Booking booking;
        private Room room;
        private String category;
        private String title;
        private String description;
        private Priority priority = Priority.MEDIUM;
        private ServiceRequestStatus status = ServiceRequestStatus.PENDING;
        private User assignedTo;
        private String notes;
        private LocalDateTime acceptedAt;
        private LocalDateTime startedAt;
        private LocalDateTime completedAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public ServiceRequestEntityBuilder id(Long id) { this.id = id; return this; }
        public ServiceRequestEntityBuilder requestReference(String requestReference) { this.requestReference = requestReference; return this; }
        public ServiceRequestEntityBuilder user(User user) { this.user = user; return this; }
        public ServiceRequestEntityBuilder booking(Booking booking) { this.booking = booking; return this; }
        public ServiceRequestEntityBuilder room(Room room) { this.room = room; return this; }
        public ServiceRequestEntityBuilder category(String category) { this.category = category; return this; }
        public ServiceRequestEntityBuilder title(String title) { this.title = title; return this; }
        public ServiceRequestEntityBuilder description(String description) { this.description = description; return this; }
        public ServiceRequestEntityBuilder priority(Priority priority) { this.priority = priority; return this; }
        public ServiceRequestEntityBuilder status(ServiceRequestStatus status) { this.status = status; return this; }
        public ServiceRequestEntityBuilder assignedTo(User assignedTo) { this.assignedTo = assignedTo; return this; }
        public ServiceRequestEntityBuilder notes(String notes) { this.notes = notes; return this; }
        public ServiceRequestEntityBuilder acceptedAt(LocalDateTime acceptedAt) { this.acceptedAt = acceptedAt; return this; }
        public ServiceRequestEntityBuilder startedAt(LocalDateTime startedAt) { this.startedAt = startedAt; return this; }
        public ServiceRequestEntityBuilder completedAt(LocalDateTime completedAt) { this.completedAt = completedAt; return this; }
        public ServiceRequestEntityBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ServiceRequestEntityBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public ServiceRequestEntity build() {
            return new ServiceRequestEntity(id, requestReference, user, booking, room, category, title, description, priority, status, assignedTo, notes, acceptedAt, startedAt, completedAt, createdAt, updatedAt);
        }
    }
}
