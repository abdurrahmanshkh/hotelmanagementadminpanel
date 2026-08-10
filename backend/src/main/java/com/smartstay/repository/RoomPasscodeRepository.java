package com.smartstay.repository;

import com.smartstay.model.RoomPasscode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoomPasscodeRepository extends JpaRepository<RoomPasscode, Long> {
    Optional<RoomPasscode> findByBookingId(Long bookingId);
}
