package com.smartstay.dto.report;

import java.util.List;
import java.util.Map;

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

    public BookingReportDto() {
    }

    public BookingReportDto(String period, int totalBookings, int completedBookings, int cancelledBookings, double cancellationRatePercentage, double averageStayDays, Map<String, Integer> bookingsByStatus, Map<String, Integer> bookingsByRoomType, List<DailyBookingDto> dailyBreakdown) {
        this.period = period;
        this.totalBookings = totalBookings;
        this.completedBookings = completedBookings;
        this.cancelledBookings = cancelledBookings;
        this.cancellationRatePercentage = cancellationRatePercentage;
        this.averageStayDays = averageStayDays;
        this.bookingsByStatus = bookingsByStatus;
        this.bookingsByRoomType = bookingsByRoomType;
        this.dailyBreakdown = dailyBreakdown;
    }

    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }

    public int getTotalBookings() { return totalBookings; }
    public void setTotalBookings(int totalBookings) { this.totalBookings = totalBookings; }

    public int getCompletedBookings() { return completedBookings; }
    public void setCompletedBookings(int completedBookings) { this.completedBookings = completedBookings; }

    public int getCancelledBookings() { return cancelledBookings; }
    public void setCancelledBookings(int cancelledBookings) { this.cancelledBookings = cancelledBookings; }

    public double getCancellationRatePercentage() { return cancellationRatePercentage; }
    public void setCancellationRatePercentage(double cancellationRatePercentage) { this.cancellationRatePercentage = cancellationRatePercentage; }

    public double getAverageStayDays() { return averageStayDays; }
    public void setAverageStayDays(double averageStayDays) { this.averageStayDays = averageStayDays; }

    public Map<String, Integer> getBookingsByStatus() { return bookingsByStatus; }
    public void setBookingsByStatus(Map<String, Integer> bookingsByStatus) { this.bookingsByStatus = bookingsByStatus; }

    public Map<String, Integer> getBookingsByRoomType() { return bookingsByRoomType; }
    public void setBookingsByRoomType(Map<String, Integer> bookingsByRoomType) { this.bookingsByRoomType = bookingsByRoomType; }

    public List<DailyBookingDto> getDailyBreakdown() { return dailyBreakdown; }
    public void setDailyBreakdown(List<DailyBookingDto> dailyBreakdown) { this.dailyBreakdown = dailyBreakdown; }

    public static BookingReportDtoBuilder builder() {
        return new BookingReportDtoBuilder();
    }

    public static class BookingReportDtoBuilder {
        private String period;
        private int totalBookings;
        private int completedBookings;
        private int cancelledBookings;
        private double cancellationRatePercentage;
        private double averageStayDays;
        private Map<String, Integer> bookingsByStatus;
        private Map<String, Integer> bookingsByRoomType;
        private List<DailyBookingDto> dailyBreakdown;

        public BookingReportDtoBuilder period(String period) { this.period = period; return this; }
        public BookingReportDtoBuilder totalBookings(int totalBookings) { this.totalBookings = totalBookings; return this; }
        public BookingReportDtoBuilder completedBookings(int completedBookings) { this.completedBookings = completedBookings; return this; }
        public BookingReportDtoBuilder cancelledBookings(int cancelledBookings) { this.cancelledBookings = cancelledBookings; return this; }
        public BookingReportDtoBuilder cancellationRatePercentage(double cancellationRatePercentage) { this.cancellationRatePercentage = cancellationRatePercentage; return this; }
        public BookingReportDtoBuilder averageStayDays(double averageStayDays) { this.averageStayDays = averageStayDays; return this; }
        public BookingReportDtoBuilder bookingsByStatus(Map<String, Integer> bookingsByStatus) { this.bookingsByStatus = bookingsByStatus; return this; }
        public BookingReportDtoBuilder bookingsByRoomType(Map<String, Integer> bookingsByRoomType) { this.bookingsByRoomType = bookingsByRoomType; return this; }
        public BookingReportDtoBuilder dailyBreakdown(List<DailyBookingDto> dailyBreakdown) { this.dailyBreakdown = dailyBreakdown; return this; }

        public BookingReportDto build() {
            return new BookingReportDto(period, totalBookings, completedBookings, cancelledBookings, cancellationRatePercentage, averageStayDays, bookingsByStatus, bookingsByRoomType, dailyBreakdown);
        }
    }

    public static class DailyBookingDto {
        private String date;
        private int total;
        private int cancelled;

        public DailyBookingDto() {
        }

        public DailyBookingDto(String date, int total, int cancelled) {
            this.date = date;
            this.total = total;
            this.cancelled = cancelled;
        }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public int getTotal() { return total; }
        public void setTotal(int total) { this.total = total; }

        public int getCancelled() { return cancelled; }
        public void setCancelled(int cancelled) { this.cancelled = cancelled; }

        public static DailyBookingDtoBuilder builder() {
            return new DailyBookingDtoBuilder();
        }

        public static class DailyBookingDtoBuilder {
            private String date;
            private int total;
            private int cancelled;

            public DailyBookingDtoBuilder date(String date) { this.date = date; return this; }
            public DailyBookingDtoBuilder total(int total) { this.total = total; return this; }
            public DailyBookingDtoBuilder cancelled(int cancelled) { this.cancelled = cancelled; return this; }

            public DailyBookingDto build() {
                return new DailyBookingDto(date, total, cancelled);
            }
        }
    }
}
