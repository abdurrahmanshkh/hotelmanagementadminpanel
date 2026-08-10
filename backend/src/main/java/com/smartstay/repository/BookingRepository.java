package com.smartstay.repository;

import com.smartstay.enums.BookingStatus;
import com.smartstay.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingReference(String bookingReference);

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    Page<Booking> findByUserId(Long userId, Pageable pageable);

    List<Booking> findByStatus(BookingStatus status);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.room.id = :roomId AND " +
           "b.checkInDate < :checkOutDate AND b.checkOutDate > :checkInDate AND " +
           "b.status IN :statuses")
    long countOverlappingBookings(
            @Param("roomId") Long roomId,
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate,
            @Param("statuses") List<BookingStatus> statuses
    );

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.room.roomType.id = :roomTypeId AND " +
           "b.checkInDate <= :date AND b.checkOutDate > :date AND " +
           "b.status IN :statuses")
    long countOccupiedRoomsByRoomTypeAndDate(
            @Param("roomTypeId") Long roomTypeId,
            @Param("date") LocalDate date,
            @Param("statuses") List<BookingStatus> statuses
    );

    @Query("SELECT b FROM Booking b WHERE " +
           "(:reference IS NULL OR LOWER(b.bookingReference) LIKE LOWER(CONCAT('%', :reference, '%'))) AND " +
           "(:guestQuery IS NULL OR LOWER(b.user.firstName) LIKE LOWER(CONCAT('%', :guestQuery, '%')) OR LOWER(b.user.lastName) LIKE LOWER(CONCAT('%', :guestQuery, '%')) OR LOWER(b.user.email) LIKE LOWER(CONCAT('%', :guestQuery, '%'))) AND " +
           "(:roomNumber IS NULL OR b.room.roomNumber = :roomNumber) AND " +
           "(:status IS NULL OR b.status = :status) AND " +
           "(:checkInFrom IS NULL OR b.checkInDate >= :checkInFrom) AND " +
           "(:checkInTo IS NULL OR b.checkInDate <= :checkInTo)")
    Page<Booking> searchBookings(
            @Param("reference") String reference,
            @Param("guestQuery") String guestQuery,
            @Param("roomNumber") String roomNumber,
            @Param("status") BookingStatus status,
            @Param("checkInFrom") LocalDate checkInFrom,
            @Param("checkInTo") LocalDate checkInTo,
            Pageable pageable
    );

    List<Booking> findByCheckInDateAndStatusIn(LocalDate checkInDate, List<BookingStatus> statuses);
    List<Booking> findByCheckOutDateAndStatusIn(LocalDate checkOutDate, List<BookingStatus> statuses);

    @Query("SELECT b FROM Booking b WHERE b.status = 'PENDING_PAYMENT' AND b.createdAt < :cutoffTime")
    List<Booking> findExpiredPendingBookings(@Param("cutoffTime") java.time.LocalDateTime cutoffTime);
}
