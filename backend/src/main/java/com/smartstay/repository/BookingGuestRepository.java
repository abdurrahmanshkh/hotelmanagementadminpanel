package com.smartstay.repository;

import com.smartstay.model.BookingGuest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingGuestRepository extends JpaRepository<BookingGuest, Long> {
    List<BookingGuest> findByBookingId(Long bookingId);
}
