package com.smartstay.service;

import com.smartstay.dto.passcode.RoomPasscodeDto;
import com.smartstay.enums.BookingStatus;
import com.smartstay.enums.PasscodeStatus;
import com.smartstay.exception.BusinessRuleException;
import com.smartstay.exception.ResourceNotFoundException;
import com.smartstay.model.Booking;
import com.smartstay.model.RoomPasscode;
import com.smartstay.repository.BookingRepository;
import com.smartstay.repository.RoomPasscodeRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
@Service
public class PasscodeService {

    private final RoomPasscodeRepository passcodeRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom = new SecureRandom();

    public PasscodeService(
            RoomPasscodeRepository passcodeRepository,
            BookingRepository bookingRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.passcodeRepository = passcodeRepository;
        this.bookingRepository = bookingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public RoomPasscodeDto generatePasscodeForBooking(Booking booking) {
        int codeInt = 100000 + secureRandom.nextInt(900000);
        String rawCode = String.valueOf(codeInt);
        String lastTwo = rawCode.substring(4);

        LocalDateTime validFrom = booking.getCheckInDate().atTime(14, 0);
        LocalDateTime validUntil = booking.getCheckOutDate().atTime(11, 0);

        PasscodeStatus initialStatus = PasscodeStatus.ACTIVE;
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(validFrom)) {
            initialStatus = PasscodeStatus.NOT_ACTIVE_YET;
        } else if (now.isAfter(validUntil)) {
            initialStatus = PasscodeStatus.EXPIRED;
        }

        RoomPasscode passcode = passcodeRepository.findByBookingId(booking.getId())
                .orElseGet(() -> RoomPasscode.builder().booking(booking).build());

        passcode.setPasscodeHash(passwordEncoder.encode(rawCode));
        passcode.setPasscodeLastTwo(lastTwo);
        passcode.setValidFrom(validFrom);
        passcode.setValidUntil(validUntil);
        passcode.setStatus(initialStatus);
        passcode.setFailedAttempts(0);
        passcode.setGeneratedAt(now);

        passcode = passcodeRepository.save(passcode);
        return RoomPasscodeDto.fromEntity(passcode, rawCode);
    }

    @Transactional
    public RoomPasscodeDto getPasscodeByBookingId(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (userId != null && !booking.getUser().getId().equals(userId)) {
            throw new BusinessRuleException("Unauthorized to access passcode for this booking");
        }

        RoomPasscode passcode = passcodeRepository.findByBookingId(bookingId)
                .orElseGet(() -> {
                    if (booking.getStatus() == BookingStatus.CONFIRMED || booking.getStatus() == BookingStatus.CHECKED_IN) {
                        RoomPasscodeDto generated = generatePasscodeForBooking(booking);
                        return passcodeRepository.findByBookingId(bookingId).get();
                    } else {
                        throw new ResourceNotFoundException("Passcode not generated for this booking");
                    }
                });

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(passcode.getValidFrom())) {
            passcode.setStatus(PasscodeStatus.NOT_ACTIVE_YET);
        } else if (now.isAfter(passcode.getValidUntil())) {
            passcode.setStatus(PasscodeStatus.EXPIRED);
        } else if (passcode.getStatus() == PasscodeStatus.NOT_ACTIVE_YET) {
            passcode.setStatus(PasscodeStatus.ACTIVE);
        }

        passcode = passcodeRepository.save(passcode);
        String mockCodeShow = passcode.getStatus() == PasscodeStatus.ACTIVE ? "482913" : null;
        return RoomPasscodeDto.fromEntity(passcode, mockCodeShow);
    }

    @Transactional
    public RoomPasscodeDto regeneratePasscode(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
        return generatePasscodeForBooking(booking);
    }
}
