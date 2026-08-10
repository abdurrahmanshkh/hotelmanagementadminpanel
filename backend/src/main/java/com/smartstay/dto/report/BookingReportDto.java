package com.smartstay.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingReportDto {
    private String period;
    private int totalBookings;
    private int completedBookings;
    private int cancelledBookings;
    private double cancellationRatePercentage;
    private double averageStayDays;
    private Map<String, Integer> bookingsByStatus;
    private Map<String, Integer> bookingsByRoomType;
    private List<DailyBookingDto> dailyBreakdown;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyBookingDto {
        private String date;
        private int total;
        private int cancelled;
    }
}
