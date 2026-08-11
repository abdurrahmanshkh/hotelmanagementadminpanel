package com.smartstay.scheduler;

import com.smartstay.enums.BookingStatus;
import com.smartstay.model.Booking;
import com.smartstay.repository.BookingRepository;
import com.smartstay.service.PricingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class ScheduledTasks {

    private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);

    private final BookingRepository bookingRepository;
    private final PricingService pricingService;

    public ScheduledTasks(BookingRepository bookingRepository, PricingService pricingService) {
        this.bookingRepository = bookingRepository;
        this.pricingService = pricingService;
    }

    // Run every 5 minutes to expire abandoned pending payment bookings
    @Scheduled(fixedRate = 300000)
    @Transactional
    public void expirePendingBookings() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(15);
        List<Booking> expired = bookingRepository.findExpiredPendingBookings(cutoff);

        for (Booking booking : expired) {
            booking.setStatus(BookingStatus.CANCELLED);
            booking.setCancellationReason("System auto-cancelled due to payment timeout (15 minutes)");
            booking.setCancelledAt(LocalDateTime.now());
            bookingRepository.save(booking);
            log.info("Auto-cancelled pending booking {}", booking.getBookingReference());
        }
    }

    // Run daily at midnight to recalculate dynamic price snapshots
    @Scheduled(cron = "0 0 0 * * ?")
    public void dailyPriceRecalculation() {
        log.info("Running daily dynamic pricing recalculation");
        pricingService.recalculatePricing();
    }
}
