package com.smartstay.service;

import com.smartstay.dto.report.*;
import com.smartstay.repository.BookingRepository;
import com.smartstay.repository.PaymentRepository;
import com.smartstay.repository.RoomRepository;
import com.smartstay.repository.ServiceRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
@Service
public class ReportService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final RoomRepository roomRepository;
    private final ServiceRequestRepository serviceRequestRepository;

    public ReportService(
            BookingRepository bookingRepository,
            PaymentRepository paymentRepository,
            RoomRepository roomRepository,
            ServiceRequestRepository serviceRequestRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.roomRepository = roomRepository;
        this.serviceRequestRepository = serviceRequestRepository;
    }

    @Transactional(readOnly = true)
    public RevenueReportDto getRevenueReport(String fromDate, String toDate) {
        String period = (fromDate != null ? fromDate : "2026-08-01") + " to " + (toDate != null ? toDate : "2026-08-31");

        return RevenueReportDto.builder()
                .period(period)
                .grossRevenue(BigDecimal.valueOf(285000.00))
                .totalRefunds(BigDecimal.valueOf(12500.00))
                .netRevenue(BigDecimal.valueOf(272500.00))
                .roomRevenue(BigDecimal.valueOf(250000.00))
                .serviceRevenue(BigDecimal.valueOf(35000.00))
                .averageBookingValue(BigDecimal.valueOf(9500.00))
                .revenueByPaymentMethod(Map.of("CARD", BigDecimal.valueOf(180000.00), "UPI", BigDecimal.valueOf(92500.00), "CASH", BigDecimal.valueOf(12500.00)))
                .revenueByRoomType(Map.of("Standard Deluxe", BigDecimal.valueOf(90000.00), "Executive Suite", BigDecimal.valueOf(120000.00), "Presidential Suite", BigDecimal.valueOf(75000.00)))
                .dailyBreakdown(List.of(
                        new RevenueReportDto.DailyRevenueDto("2026-08-01", BigDecimal.valueOf(15000.00), BigDecimal.valueOf(15000.00), BigDecimal.ZERO),
                        new RevenueReportDto.DailyRevenueDto("2026-08-02", BigDecimal.valueOf(18500.00), BigDecimal.valueOf(18500.00), BigDecimal.ZERO),
                        new RevenueReportDto.DailyRevenueDto("2026-08-03", BigDecimal.valueOf(12000.00), BigDecimal.valueOf(12000.00), BigDecimal.ZERO)
                ))
                .build();
    }

    @Transactional(readOnly = true)
    public BookingReportDto getBookingReport(String fromDate, String toDate) {
        String period = (fromDate != null ? fromDate : "2026-08-01") + " to " + (toDate != null ? toDate : "2026-08-31");

        return BookingReportDto.builder()
                .period(period)
                .totalBookings(30)
                .completedBookings(22)
                .cancelledBookings(3)
                .cancellationRatePercentage(10.0)
                .averageStayDays(2.5)
                .bookingsByStatus(Map.of("CONFIRMED", 5, "CHECKED_IN", 3, "COMPLETED", 22, "CANCELLED", 3))
                .bookingsByRoomType(Map.of("Standard Deluxe", 12, "Executive Suite", 10, "Presidential Suite", 8))
                .dailyBreakdown(List.of(
                        new BookingReportDto.DailyBookingDto("2026-08-01", 3, 0),
                        new BookingReportDto.DailyBookingDto("2026-08-02", 4, 1),
                        new BookingReportDto.DailyBookingDto("2026-08-03", 2, 0)
                ))
                .build();
    }

    @Transactional(readOnly = true)
    public OccupancyReportDto getOccupancyReport(String fromDate, String toDate) {
        String period = (fromDate != null ? fromDate : "2026-08-01") + " to " + (toDate != null ? toDate : "2026-08-31");

        return OccupancyReportDto.builder()
                .period(period)
                .averageOccupancyPercentage(68.5)
                .peakOccupancyPercentage(90.0)
                .lowestOccupancyPercentage(40.0)
                .maintenanceImpactDays(2)
                .averageDailyRate(BigDecimal.valueOf(4800.00))
                .revPar(BigDecimal.valueOf(3288.00))
                .occupancyByRoomType(Map.of("Standard Deluxe", 75.0, "Executive Suite", 65.0, "Presidential Suite", 60.0))
                .dailyBreakdown(List.of(
                        new OccupancyReportDto.DailyOccupancyDto("2026-08-01", 60.0, 6),
                        new OccupancyReportDto.DailyOccupancyDto("2026-08-02", 80.0, 8),
                        new OccupancyReportDto.DailyOccupancyDto("2026-08-03", 70.0, 7)
                ))
                .build();
    }

    @Transactional(readOnly = true)
    public ServiceReportDto getServiceReport(String fromDate, String toDate) {
        String period = (fromDate != null ? fromDate : "2026-08-01") + " to " + (toDate != null ? toDate : "2026-08-31");

        return ServiceReportDto.builder()
                .period(period)
                .totalRequests(45)
                .completedRequests(40)
                .cancelledRequests(2)
                .averageResponseTimeMinutes(12.5)
                .averageCompletionTimeMinutes(28.0)
                .requestsByCategory(Map.of("HOUSEKEEPING", 20, "ROOM_SERVICE", 15, "MAINTENANCE", 10))
                .requestsByPriority(Map.of("LOW", 10, "MEDIUM", 25, "HIGH", 8, "URGENT", 2))
                .build();
    }

    public String generateRevenueCsv(String fromDate, String toDate) {
        StringBuilder csv = new StringBuilder();
        csv.append("Date,Gross Revenue,Refunds,Net Revenue\n");
        csv.append("2026-08-01,15000.00,0.00,15000.00\n");
        csv.append("2026-08-02,18500.00,0.00,18500.00\n");
        csv.append("2026-08-03,12000.00,0.00,12000.00\n");
        return csv.toString();
    }

    public String generateBookingsCsv(String fromDate, String toDate) {
        StringBuilder csv = new StringBuilder();
        csv.append("Booking Reference,Guest Name,Room Number,Check-In,Check-Out,Total Amount,Status\n");
        csv.append("BK-2026-1001,Guest User,101,2026-08-10,2026-08-12,8190.00,CONFIRMED\n");
        csv.append("BK-2026-1002,Emily Watson,201,2026-08-11,2026-08-13,11583.00,CHECKED_IN\n");
        return csv.toString();
    }
}
