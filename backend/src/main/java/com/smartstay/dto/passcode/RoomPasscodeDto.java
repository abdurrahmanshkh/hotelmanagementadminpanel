package com.smartstay.dto.passcode;

import com.smartstay.enums.PasscodeStatus;
import com.smartstay.model.RoomPasscode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
                .validFrom(p.getValidFrom() != null ? p.getValidFrom().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME) : null)
                .validUntil(p.getValidUntil() != null ? p.getValidUntil().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME) : null)
                .failedAttempts(p.getFailedAttempts() != null ? p.getFailedAttempts() : 0)
                .maxAllowedAttempts(5)
                .lockoutUntil(p.getLockedUntil() != null ? p.getLockedUntil().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME) : null)
                .createdAt(p.getCreatedAt() != null ? p.getCreatedAt().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME) : null)
                .updatedAt(p.getUpdatedAt() != null ? p.getUpdatedAt().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME) : null)
                .build();
    }
}
