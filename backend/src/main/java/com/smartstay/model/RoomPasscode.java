package com.smartstay.model;

import com.smartstay.enums.PasscodeStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "room_passcodes")
public class RoomPasscode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @Column(name = "passcode_hash", nullable = false)
    private String passcodeHash;

    @Column(name = "passcode_last_two")
    private String passcodeLastTwo;

    @Transient
    private String plainPasscode;

    @Column(name = "valid_from", nullable = false)
    private LocalDateTime validFrom;

    @Column(name = "valid_until", nullable = false)
    private LocalDateTime validUntil;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PasscodeStatus status = PasscodeStatus.NOT_ACTIVE_YET;

    @Column(name = "failed_attempts", nullable = false)
    private Integer failedAttempts = 0;

    @Column(name = "locked_until")
    private LocalDateTime lockedUntil;

    @Column(name = "generated_at", nullable = false)
    private LocalDateTime generatedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public RoomPasscode() {
    }

    public RoomPasscode(Long id, Booking booking, String passcodeHash, String passcodeLastTwo, String plainPasscode, LocalDateTime validFrom, LocalDateTime validUntil, PasscodeStatus status, Integer failedAttempts, LocalDateTime lockedUntil, LocalDateTime generatedAt, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.booking = booking;
        this.passcodeHash = passcodeHash;
        this.passcodeLastTwo = passcodeLastTwo;
        this.plainPasscode = plainPasscode;
        this.validFrom = validFrom;
        this.validUntil = validUntil;
        this.status = status != null ? status : PasscodeStatus.NOT_ACTIVE_YET;
        this.failedAttempts = failedAttempts != null ? failedAttempts : 0;
        this.lockedUntil = lockedUntil;
        this.generatedAt = generatedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.generatedAt == null) this.generatedAt = LocalDateTime.now();
        if (this.status == null) this.status = PasscodeStatus.NOT_ACTIVE_YET;
        if (this.failedAttempts == null) this.failedAttempts = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public String getPasscodeHash() { return passcodeHash; }
    public void setPasscodeHash(String passcodeHash) { this.passcodeHash = passcodeHash; }

    public String getPasscodeLastTwo() { return passcodeLastTwo; }
    public void setPasscodeLastTwo(String passcodeLastTwo) { this.passcodeLastTwo = passcodeLastTwo; }

    public String getPlainPasscode() { return plainPasscode; }
    public void setPlainPasscode(String plainPasscode) { this.plainPasscode = plainPasscode; }

    public LocalDateTime getValidFrom() { return validFrom; }
    public void setValidFrom(LocalDateTime validFrom) { this.validFrom = validFrom; }

    public LocalDateTime getValidUntil() { return validUntil; }
    public void setValidUntil(LocalDateTime validUntil) { this.validUntil = validUntil; }

    public PasscodeStatus getStatus() { return status; }
    public void setStatus(PasscodeStatus status) { this.status = status; }

    public Integer getFailedAttempts() { return failedAttempts; }
    public void setFailedAttempts(Integer failedAttempts) { this.failedAttempts = failedAttempts; }

    public LocalDateTime getLockedUntil() { return lockedUntil; }
    public void setLockedUntil(LocalDateTime lockedUntil) { this.lockedUntil = lockedUntil; }

    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static RoomPasscodeBuilder builder() {
        return new RoomPasscodeBuilder();
    }

    public static class RoomPasscodeBuilder {
        private Long id;
        private Booking booking;
        private String passcodeHash;
        private String passcodeLastTwo;
        private String plainPasscode;
        private LocalDateTime validFrom;
        private LocalDateTime validUntil;
        private PasscodeStatus status = PasscodeStatus.NOT_ACTIVE_YET;
        private Integer failedAttempts = 0;
        private LocalDateTime lockedUntil;
        private LocalDateTime generatedAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public RoomPasscodeBuilder id(Long id) { this.id = id; return this; }
        public RoomPasscodeBuilder booking(Booking booking) { this.booking = booking; return this; }
        public RoomPasscodeBuilder passcodeHash(String passcodeHash) { this.passcodeHash = passcodeHash; return this; }
        public RoomPasscodeBuilder passcodeLastTwo(String passcodeLastTwo) { this.passcodeLastTwo = passcodeLastTwo; return this; }
        public RoomPasscodeBuilder plainPasscode(String plainPasscode) { this.plainPasscode = plainPasscode; return this; }
        public RoomPasscodeBuilder validFrom(LocalDateTime validFrom) { this.validFrom = validFrom; return this; }
        public RoomPasscodeBuilder validUntil(LocalDateTime validUntil) { this.validUntil = validUntil; return this; }
        public RoomPasscodeBuilder status(PasscodeStatus status) { this.status = status; return this; }
        public RoomPasscodeBuilder failedAttempts(Integer failedAttempts) { this.failedAttempts = failedAttempts; return this; }
        public RoomPasscodeBuilder lockedUntil(LocalDateTime lockedUntil) { this.lockedUntil = lockedUntil; return this; }
        public RoomPasscodeBuilder generatedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; return this; }
        public RoomPasscodeBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public RoomPasscodeBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public RoomPasscode build() {
            return new RoomPasscode(id, booking, passcodeHash, passcodeLastTwo, plainPasscode, validFrom, validUntil, status, failedAttempts, lockedUntil, generatedAt, createdAt, updatedAt);
        }
    }
}
