package com.smartstay.dto.passcode;

import com.smartstay.enums.PasscodeStatus;
import com.smartstay.model.RoomPasscode;

import java.time.format.DateTimeFormatter;

public class RoomPasscodeDto {

    private Long id;
    private Long bookingId;
    private String bookingReference;
    private Long roomId;
    private String roomNumber;
    private Long userId;
    private String passcode;
    private String maskedPasscode;
    private PasscodeStatus status;
    private String validFrom;
    private String validUntil;
    private int failedAttempts;
    private int maxAllowedAttempts;
    private String lockoutUntil;
    private String createdAt;
    private String updatedAt;

    public RoomPasscodeDto() {
    }

    public RoomPasscodeDto(Long id, Long bookingId, String bookingReference, Long roomId, String roomNumber, Long userId, String passcode, String maskedPasscode, PasscodeStatus status, String validFrom, String validUntil, int failedAttempts, int maxAllowedAttempts, String lockoutUntil, String createdAt, String updatedAt) {
        this.id = id;
        this.bookingId = bookingId;
        this.bookingReference = bookingReference;
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.userId = userId;
        this.passcode = passcode;
        this.maskedPasscode = maskedPasscode;
        this.status = status;
        this.validFrom = validFrom;
        this.validUntil = validUntil;
        this.failedAttempts = failedAttempts;
        this.maxAllowedAttempts = maxAllowedAttempts;
        this.lockoutUntil = lockoutUntil;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getPasscode() { return passcode; }
    public void setPasscode(String passcode) { this.passcode = passcode; }

    public String getMaskedPasscode() { return maskedPasscode; }
    public void setMaskedPasscode(String maskedPasscode) { this.maskedPasscode = maskedPasscode; }

    public PasscodeStatus getStatus() { return status; }
    public void setStatus(PasscodeStatus status) { this.status = status; }

    public String getValidFrom() { return validFrom; }
    public void setValidFrom(String validFrom) { this.validFrom = validFrom; }

    public String getValidUntil() { return validUntil; }
    public void setValidUntil(String validUntil) { this.validUntil = validUntil; }

    public int getFailedAttempts() { return failedAttempts; }
    public void setFailedAttempts(int failedAttempts) { this.failedAttempts = failedAttempts; }

    public int getMaxAllowedAttempts() { return maxAllowedAttempts; }
    public void setMaxAllowedAttempts(int maxAllowedAttempts) { this.maxAllowedAttempts = maxAllowedAttempts; }

    public String getLockoutUntil() { return lockoutUntil; }
    public void setLockoutUntil(String lockoutUntil) { this.lockoutUntil = lockoutUntil; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

    public static RoomPasscodeDto fromEntity(RoomPasscode p, String rawPasscode) {
        if (p == null) return null;

        String bRef = p.getBooking() != null ? p.getBooking().getBookingReference() : "";
        Long rId = (p.getBooking() != null && p.getBooking().getRoom() != null) ? p.getBooking().getRoom().getId() : null;
        String rNum = (p.getBooking() != null && p.getBooking().getRoom() != null) ? p.getBooking().getRoom().getRoomNumber() : "";
        Long uId = (p.getBooking() != null && p.getBooking().getUser() != null) ? p.getBooking().getUser().getId() : null;

        String lastTwo = p.getPasscodeLastTwo() != null ? p.getPasscodeLastTwo() : "12";
        String masked = "****" + lastTwo;

        return RoomPasscodeDto.builder()
                .id(p.getId())
                .bookingId(p.getBooking() != null ? p.getBooking().getId() : null)
                .bookingReference(bRef)
                .roomId(rId)
                .roomNumber(rNum)
                .userId(uId)
                .passcode(rawPasscode)
                .maskedPasscode(masked)
                .status(p.getStatus())
                .validFrom(p.getValidFrom() != null ? p.getValidFrom().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .validUntil(p.getValidUntil() != null ? p.getValidUntil().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .failedAttempts(p.getFailedAttempts() != null ? p.getFailedAttempts() : 0)
                .maxAllowedAttempts(5)
                .lockoutUntil(p.getLockedUntil() != null ? p.getLockedUntil().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .createdAt(p.getCreatedAt() != null ? p.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .updatedAt(p.getUpdatedAt() != null ? p.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .build();
    }

    public static RoomPasscodeDtoBuilder builder() {
        return new RoomPasscodeDtoBuilder();
    }

    public static class RoomPasscodeDtoBuilder {
        private Long id;
        private Long bookingId;
        private String bookingReference;
        private Long roomId;
        private String roomNumber;
        private Long userId;
        private String passcode;
        private String maskedPasscode;
        private PasscodeStatus status;
        private String validFrom;
        private String validUntil;
        private int failedAttempts;
        private int maxAllowedAttempts;
        private String lockoutUntil;
        private String createdAt;
        private String updatedAt;

        public RoomPasscodeDtoBuilder id(Long id) { this.id = id; return this; }
        public RoomPasscodeDtoBuilder bookingId(Long bookingId) { this.bookingId = bookingId; return this; }
        public RoomPasscodeDtoBuilder bookingReference(String bookingReference) { this.bookingReference = bookingReference; return this; }
        public RoomPasscodeDtoBuilder roomId(Long roomId) { this.roomId = roomId; return this; }
        public RoomPasscodeDtoBuilder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public RoomPasscodeDtoBuilder userId(Long userId) { this.userId = userId; return this; }
        public RoomPasscodeDtoBuilder passcode(String passcode) { this.passcode = passcode; return this; }
        public RoomPasscodeDtoBuilder maskedPasscode(String maskedPasscode) { this.maskedPasscode = maskedPasscode; return this; }
        public RoomPasscodeDtoBuilder status(PasscodeStatus status) { this.status = status; return this; }
        public RoomPasscodeDtoBuilder validFrom(String validFrom) { this.validFrom = validFrom; return this; }
        public RoomPasscodeDtoBuilder validUntil(String validUntil) { this.validUntil = validUntil; return this; }
        public RoomPasscodeDtoBuilder failedAttempts(int failedAttempts) { this.failedAttempts = failedAttempts; return this; }
        public RoomPasscodeDtoBuilder maxAllowedAttempts(int maxAllowedAttempts) { this.maxAllowedAttempts = maxAllowedAttempts; return this; }
        public RoomPasscodeDtoBuilder lockoutUntil(String lockoutUntil) { this.lockoutUntil = lockoutUntil; return this; }
        public RoomPasscodeDtoBuilder createdAt(String createdAt) { this.createdAt = createdAt; return this; }
        public RoomPasscodeDtoBuilder updatedAt(String updatedAt) { this.updatedAt = updatedAt; return this; }

        public RoomPasscodeDto build() {
            return new RoomPasscodeDto(id, bookingId, bookingReference, roomId, roomNumber, userId, passcode, maskedPasscode, status, validFrom, validUntil, failedAttempts, maxAllowedAttempts, lockoutUntil, createdAt, updatedAt);
        }
    }
}
