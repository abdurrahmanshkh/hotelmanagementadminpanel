package com.smartstay.model;

import com.smartstay.enums.MaintenanceStatus;
import com.smartstay.enums.Priority;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_records")
public class MaintenanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "record_number", nullable = false, unique = true)
    private String recordNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private Priority priority = Priority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MaintenanceStatus status = MaintenanceStatus.OPEN;

    @Column(name = "reported_by")
    private String reportedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_technician_id")
    private User assignedTechnician;

    @Column(name = "resolution_notes", length = 500)
    private String resolutionNotes;

    @Column(name = "cleaning_required_on_completion")
    private Boolean cleaningRequiredOnCompletion = true;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "on_hold_at")
    private LocalDateTime onHoldAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public MaintenanceRecord() {
    }

    public MaintenanceRecord(Long id, String recordNumber, Room room, String title, String description, Priority priority, MaintenanceStatus status, String reportedBy, User assignedTechnician, String resolutionNotes, Boolean cleaningRequiredOnCompletion, LocalDateTime assignedAt, LocalDateTime startedAt, LocalDateTime onHoldAt, LocalDateTime completedAt, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.recordNumber = recordNumber;
        this.room = room;
        this.title = title;
        this.description = description;
        this.priority = priority != null ? priority : Priority.MEDIUM;
        this.status = status != null ? status : MaintenanceStatus.OPEN;
        this.reportedBy = reportedBy;
        this.assignedTechnician = assignedTechnician;
        this.resolutionNotes = resolutionNotes;
        this.cleaningRequiredOnCompletion = cleaningRequiredOnCompletion != null ? cleaningRequiredOnCompletion : true;
        this.assignedAt = assignedAt;
        this.startedAt = startedAt;
        this.onHoldAt = onHoldAt;
        this.completedAt = completedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.priority == null) this.priority = Priority.MEDIUM;
        if (this.status == null) this.status = MaintenanceStatus.OPEN;
        if (this.cleaningRequiredOnCompletion == null) this.cleaningRequiredOnCompletion = true;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRecordNumber() { return recordNumber; }
    public void setRecordNumber(String recordNumber) { this.recordNumber = recordNumber; }

    public Room getRoom() { return room; }
    public void setRoom(Room room) { this.room = room; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public MaintenanceStatus getStatus() { return status; }
    public void setStatus(MaintenanceStatus status) { this.status = status; }

    public String getReportedBy() { return reportedBy; }
    public void setReportedBy(String reportedBy) { this.reportedBy = reportedBy; }

    public User getAssignedTechnician() { return assignedTechnician; }
    public void setAssignedTechnician(User assignedTechnician) { this.assignedTechnician = assignedTechnician; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }

    public Boolean getCleaningRequiredOnCompletion() { return cleaningRequiredOnCompletion; }
    public void setCleaningRequiredOnCompletion(Boolean cleaningRequiredOnCompletion) { this.cleaningRequiredOnCompletion = cleaningRequiredOnCompletion; }

    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getOnHoldAt() { return onHoldAt; }
    public void setOnHoldAt(LocalDateTime onHoldAt) { this.onHoldAt = onHoldAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static MaintenanceRecordBuilder builder() {
        return new MaintenanceRecordBuilder();
    }

    public static class MaintenanceRecordBuilder {
        private Long id;
        private String recordNumber;
        private Room room;
        private String title;
        private String description;
        private Priority priority = Priority.MEDIUM;
        private MaintenanceStatus status = MaintenanceStatus.OPEN;
        private String reportedBy;
        private User assignedTechnician;
        private String resolutionNotes;
        private Boolean cleaningRequiredOnCompletion = true;
        private LocalDateTime assignedAt;
        private LocalDateTime startedAt;
        private LocalDateTime onHoldAt;
        private LocalDateTime completedAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public MaintenanceRecordBuilder id(Long id) { this.id = id; return this; }
        public MaintenanceRecordBuilder recordNumber(String recordNumber) { this.recordNumber = recordNumber; return this; }
        public MaintenanceRecordBuilder room(Room room) { this.room = room; return this; }
        public MaintenanceRecordBuilder title(String title) { this.title = title; return this; }
        public MaintenanceRecordBuilder description(String description) { this.description = description; return this; }
        public MaintenanceRecordBuilder priority(Priority priority) { this.priority = priority; return this; }
        public MaintenanceRecordBuilder status(MaintenanceStatus status) { this.status = status; return this; }
        public MaintenanceRecordBuilder reportedBy(String reportedBy) { this.reportedBy = reportedBy; return this; }
        public MaintenanceRecordBuilder assignedTechnician(User assignedTechnician) { this.assignedTechnician = assignedTechnician; return this; }
        public MaintenanceRecordBuilder resolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; return this; }
        public MaintenanceRecordBuilder cleaningRequiredOnCompletion(Boolean cleaningRequiredOnCompletion) { this.cleaningRequiredOnCompletion = cleaningRequiredOnCompletion; return this; }
        public MaintenanceRecordBuilder assignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; return this; }
        public MaintenanceRecordBuilder startedAt(LocalDateTime startedAt) { this.startedAt = startedAt; return this; }
        public MaintenanceRecordBuilder onHoldAt(LocalDateTime onHoldAt) { this.onHoldAt = onHoldAt; return this; }
        public MaintenanceRecordBuilder completedAt(LocalDateTime completedAt) { this.completedAt = completedAt; return this; }
        public MaintenanceRecordBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public MaintenanceRecordBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public MaintenanceRecord build() {
            return new MaintenanceRecord(id, recordNumber, room, title, description, priority, status, reportedBy, assignedTechnician, resolutionNotes, cleaningRequiredOnCompletion, assignedAt, startedAt, onHoldAt, completedAt, createdAt, updatedAt);
        }
    }
}
