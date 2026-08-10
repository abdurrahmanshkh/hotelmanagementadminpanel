package com.smartstay.service;

import com.smartstay.config.AppProperties;
import com.smartstay.dto.booking.*;
import com.smartstay.dto.common.PageData;
import com.smartstay.enums.BookingStatus;
import com.smartstay.enums.CleaningTaskStatus;
import com.smartstay.enums.RoomStatus;
import com.smartstay.exception.BusinessRuleException;
import com.smartstay.exception.ConflictException;
import com.smartstay.exception.ResourceNotFoundException;
import com.smartstay.model.*;
import com.smartstay.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingGuestRepository bookingGuestRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final CleaningTaskRepository cleaningTaskRepository;
    private final PricingService pricingService;
    private final HotelSettingsRepository hotelSettingsRepository;
    private final AppProperties appProperties;

    @Transactional(readOnly = true)
    public BookingQuoteDto generateQuote(BookingQuoteRequestDto req) {
        LocalDate checkIn = LocalDate.parse(req.getCheckInDate());
        LocalDate checkOut = LocalDate.parse(req.getCheckOutDate());

        if (!checkOut.isAfter(checkIn)) {
            throw new BusinessRuleException("Check-out date must be after check-in date");
        }

        Room room = roomRepository.findById(req.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + req.getRoomId()));

        int nights = (int) ChronoUnit.DAYS.between(checkIn, checkOut);
        BigDecimal appliedNightlyPrice = pricingService.calculateNightlyPrice(room.getRoomType(), checkIn);
        BigDecimal roomAmount = appliedNightlyPrice.multiply(BigDecimal.valueOf(nights));

        HotelSettings settings = hotelSettingsRepository.findById(1L).orElse(null);
        double taxPct = settings != null ? settings.getTaxPercentage() : appProperties.getHotel().getTaxPercentage();
        double feePct = settings != null ? settings.getServiceFeePercentage() : appProperties.getHotel().getServiceFeePercentage();

        BigDecimal taxAmount = roomAmount.multiply(BigDecimal.valueOf(taxPct / 100.0)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal serviceFee = roomAmount.multiply(BigDecimal.valueOf(feePct / 100.0)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = roomAmount.add(taxAmount).add(serviceFee);

        String quoteId = "QT-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        LocalDateTime validUntil = LocalDateTime.now().plusMinutes(15);

        return BookingQuoteDto.builder()
                .quoteId(quoteId)
                .roomId(room.getId())
                .numberOfNights(nights)
                .basePricePerNight(room.getRoomType().getBasePrice())
                .appliedPricePerNight(appliedNightlyPrice)
                .roomAmount(roomAmount)
                .taxPercentage(taxPct)
                .taxAmount(taxAmount)
                .serviceFeePercentage(feePct)
                .serviceFee(serviceFee)
                .discountAmount(BigDecimal.ZERO)
                .totalAmount(totalAmount)
                .currency("INR")
                .validUntil(validUntil.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .build();
    }

    @Transactional
    public BookingDto createBooking(User user, CreateBookingRequestDto req) {
        LocalDate checkIn = LocalDate.parse(req.getCheckInDate());
        LocalDate checkOut = LocalDate.parse(req.getCheckOutDate());

        if (!checkOut.isAfter(checkIn)) {
            throw new BusinessRuleException("Check-out date must be after check-in date");
        }

        Room room = roomRepository.findById(req.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + req.getRoomId()));

        if (!Boolean.TRUE.equals(room.getActive()) || room.getStatus() == RoomStatus.MAINTENANCE) {
            throw new BusinessRuleException("The selected room is unavailable for booking");
        }

        int adults = req.getAdults() > 0 ? req.getAdults() : 1;
        if (adults > room.getRoomType().getMaximumAdults()) {
            throw new BusinessRuleException("Guest count exceeds maximum adult capacity for this room");
        }

        // Overlap protection check inside transaction
        long overlapCount = bookingRepository.countOverlappingBookings(
                room.getId(), checkIn, checkOut,
                List.of(BookingStatus.PENDING_PAYMENT, BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN)
        );

        if (overlapCount > 0) {
            throw new ConflictException("The selected room is not available for these dates");
        }

        int nights = (int) ChronoUnit.DAYS.between(checkIn, checkOut);
        BigDecimal appliedNightlyPrice = pricingService.calculateNightlyPrice(room.getRoomType(), checkIn);
        BigDecimal roomAmount = appliedNightlyPrice.multiply(BigDecimal.valueOf(nights));

        HotelSettings settings = hotelSettingsRepository.findById(1L).orElse(null);
        double taxPct = settings != null ? settings.getTaxPercentage() : appProperties.getHotel().getTaxPercentage();
        double feePct = settings != null ? settings.getServiceFeePercentage() : appProperties.getHotel().getServiceFeePercentage();

        BigDecimal taxAmount = roomAmount.multiply(BigDecimal.valueOf(taxPct / 100.0)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal serviceFee = roomAmount.multiply(BigDecimal.valueOf(feePct / 100.0)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = roomAmount.add(taxAmount).add(serviceFee);

        String refYear = String.valueOf(LocalDate.now().getYear());
        String bookingRef = "BK-" + refYear + "-" + String.format("%04d", (int)(Math.random() * 9000) + 1000);

        LocalDateTime expectedIn = LocalDateTime.of(checkIn, LocalTime.of(14, 0));
        LocalDateTime expectedOut = LocalDateTime.of(checkOut, LocalTime.of(11, 0));

        Booking booking = Booking.builder()
                .bookingReference(bookingRef)
                .user(user)
                .room(room)
                .checkInDate(checkIn)
                .checkOutDate(checkOut)
                .expectedCheckInAt(expectedIn)
                .expectedCheckOutAt(expectedOut)
                .guestCount(adults + req.getChildren())
                .adults(adults)
                .children(req.getChildren())
                .status(BookingStatus.PENDING_PAYMENT)
                .basePricePerNight(room.getRoomType().getBasePrice())
                .appliedPricePerNight(appliedNightlyPrice)
                .numberOfNights(nights)
                .roomAmount(roomAmount)
                .taxAmount(taxAmount)
                .serviceFee(serviceFee)
                .discountAmount(BigDecimal.ZERO)
                .totalAmount(totalAmount)
                .currency("INR")
                .specialRequests(req.getSpecialRequests())
                .build();

        booking = bookingRepository.save(booking);

        BookingGuest guest = BookingGuest.builder()
                .booking(booking)
                .fullName(user.getFullName())
                .primaryGuest(true)
                .governmentIdType(user.getGovernmentIdType())
                .governmentIdLastFour(user.getGovernmentIdLastFour())
                .build();
        bookingGuestRepository.save(guest);

        return BookingDto.fromEntity(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingDto> getCustomerBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(BookingDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingDto getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));
        return BookingDto.fromEntity(booking);
    }

    @Transactional
    public BookingDto cancelBooking(Long bookingId, Long userId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (userId != null && !booking.getUser().getId().equals(userId)) {
            throw new BusinessRuleException("Unauthorized to cancel this booking");
        }

        if (booking.getStatus() == BookingStatus.COMPLETED || booking.getStatus() == BookingStatus.CHECKED_IN) {
            throw new BusinessRuleException("Cannot cancel a booking that is checked-in or completed");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason(reason != null ? reason : "Cancelled by user");
        booking.setCancelledAt(LocalDateTime.now());
        booking = bookingRepository.save(booking);

        return BookingDto.fromEntity(booking);
    }

    @Transactional(readOnly = true)
    public PageData<BookingDto> searchBookings(
            String reference, String guestQuery, String roomNumber, BookingStatus status,
            String checkInFrom, String checkInTo, int page, int size, String sortBy
    ) {
        LocalDate from = checkInFrom != null && !checkInFrom.isBlank() ? LocalDate.parse(checkInFrom) : null;
        LocalDate to = checkInTo != null && !checkInTo.isBlank() ? LocalDate.parse(checkInTo) : null;

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Booking> bookingPage = bookingRepository.searchBookings(reference, guestQuery, roomNumber, status, from, to, pageable);

        List<BookingDto> dtos = bookingPage.getContent().stream()
                .map(BookingDto::fromEntity)
                .collect(Collectors.toList());

        return PageData.of(dtos, bookingPage.getNumber(), bookingPage.getSize(), bookingPage.getTotalElements());
    }

    @Transactional
    public BookingDto checkInGuest(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (booking.getStatus() != BookingStatus.CONFIRMED && booking.getStatus() != BookingStatus.PENDING_PAYMENT) {
            throw new BusinessRuleException("Only confirmed bookings can be checked in");
        }

        booking.setStatus(BookingStatus.CHECKED_IN);
        booking.setActualCheckInAt(LocalDateTime.now());
        booking.getRoom().setStatus(RoomStatus.OCCUPIED);
        roomRepository.save(booking.getRoom());
        booking = bookingRepository.save(booking);

        return BookingDto.fromEntity(booking);
    }

    @Transactional
    public BookingDto checkOutGuest(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (booking.getStatus() != BookingStatus.CHECKED_IN) {
            throw new BusinessRuleException("Only checked-in bookings can be checked out");
        }

        booking.setStatus(BookingStatus.COMPLETED);
        booking.setActualCheckOutAt(LocalDateTime.now());

        Room room = booking.getRoom();
        room.setStatus(RoomStatus.UNDER_CLEANING);
        roomRepository.save(room);

        // Generate housekeeping task
        String taskRef = "CLN-" + String.format("%04d", (int)(Math.random() * 9000) + 1000);
        CleaningTask task = CleaningTask.builder()
                .taskNumber(taskRef)
                .room(room)
                .createdFromBooking(booking)
                .status(CleaningTaskStatus.PENDING)
                .notes("Generated automatically on checkout of booking " + booking.getBookingReference())
                .build();
        cleaningTaskRepository.save(task);

        booking = bookingRepository.save(booking);
        return BookingDto.fromEntity(booking);
    }
}
