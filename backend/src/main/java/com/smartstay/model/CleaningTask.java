package com.smartstay.model;

import com.smartstay.enums.CleaningTaskStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cleaning_tasks")
public class CleaningTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "task_number", nullable = false, unique = true)
    private String taskNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_from_booking_id")
    private Booking createdFromBooking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_staff_id")
    private User assignedStaff;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CleaningTaskStatus status = CleaningTaskStatus.PENDING;

    @Column(name = "notes", length = 500)
    private String notes;

    @Column(name = "maintenance_issue_found")
    private Boolean maintenanceIssueFound = false;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public CleaningTask() {
    }

    public CleaningTask(Long id, String taskNumber, Room room, Booking createdFromBooking, User assignedStaff, CleaningTaskStatus status, String notes, Boolean maintenanceIssueFound, LocalDateTime assignedAt, LocalDateTime startedAt, LocalDateTime completedAt, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.taskNumber = taskNumber;
        this.room = room;
        this.createdFromBooking = createdFromBooking;
        this.assignedStaff = assignedStaff;
        this.status = status != null ? status : CleaningTaskStatus.PENDING;
        this.notes = notes;
        this.maintenanceIssueFound = maintenanceIssueFound != null ? maintenanceIssueFound : false;
        this.assignedAt = assignedAt;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) this.status = CleaningTaskStatus.PENDING;
        if (this.maintenanceIssueFound == null) this.maintenanceIssueFound = false;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTaskNumber() { return taskNumber; }
    public void setTaskNumber(String taskNumber) { this.taskNumber = taskNumber; }

    public Room getRoom() { return room; }
    public void setRoom(Room room) { this.room = room; }

    public Booking getCreatedFromBooking() { return createdFromBooking; }
    public void setCreatedFromBooking(Booking createdFromBooking) { this.createdFromBooking = createdFromBooking; }

    public User getAssignedStaff() { return assignedStaff; }
    public void setAssignedStaff(User assignedStaff) { this.assignedStaff = assignedStaff; }

    public CleaningTaskStatus getStatus() { return status; }
    public void setStatus(CleaningTaskStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Boolean getMaintenanceIssueFound() { return maintenanceIssueFound; }
    public void setMaintenanceIssueFound(Boolean maintenanceIssueFound) { this.maintenanceIssueFound = maintenanceIssueFound; }

    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static CleaningTaskBuilder builder() {
        return new CleaningTaskBuilder();
    }

    public static class CleaningTaskBuilder {
        private Long id;
        private String taskNumber;
        private Room room;
        private Booking createdFromBooking;
        private User assignedStaff;
        private CleaningTaskStatus status = CleaningTaskStatus.PENDING;
        private String notes;
        private Boolean maintenanceIssueFound = false;
        private LocalDateTime assignedAt;
        private LocalDateTime startedAt;
        private LocalDateTime completedAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public CleaningTaskBuilder id(Long id) { this.id = id; return this; }
        public CleaningTaskBuilder taskNumber(String taskNumber) { this.taskNumber = taskNumber; return this; }
        public CleaningTaskBuilder room(Room room) { this.room = room; return this; }
        public CleaningTaskBuilder createdFromBooking(Booking createdFromBooking) { this.createdFromBooking = createdFromBooking; return this; }
        public CleaningTaskBuilder assignedStaff(User assignedStaff) { this.assignedStaff = assignedStaff; return this; }
        public CleaningTaskBuilder status(CleaningTaskStatus status) { this.status = status; return this; }
        public CleaningTaskBuilder notes(String notes) { this.notes = notes; return this; }
        public CleaningTaskBuilder maintenanceIssueFound(Boolean maintenanceIssueFound) { this.maintenanceIssueFound = maintenanceIssueFound; return this; }
        public CleaningTaskBuilder assignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; return this; }
        public CleaningTaskBuilder startedAt(LocalDateTime startedAt) { this.startedAt = startedAt; return this; }
        public CleaningTaskBuilder completedAt(LocalDateTime completedAt) { this.completedAt = completedAt; return this; }
        public CleaningTaskBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public CleaningTaskBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public CleaningTask build() {
            return new CleaningTask(id, taskNumber, room, createdFromBooking, assignedStaff, status, notes, maintenanceIssueFound, assignedAt, startedAt, completedAt, createdAt, updatedAt);
        }
    }
}
