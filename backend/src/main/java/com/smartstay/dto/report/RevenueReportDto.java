package com.smartstay.dto.report;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class RevenueReportDto {
    private String period;
    private BigDecimal grossRevenue;
    private BigDecimal totalRefunds;
    private BigDecimal netRevenue;
    private BigDecimal roomRevenue;
    private BigDecimal serviceRevenue;
    private BigDecimal averageBookingValue;
    private Map<String, BigDecimal> revenueByPaymentMethod;
    private Map<String, BigDecimal> revenueByRoomType;
    private List<DailyRevenueDto> dailyBreakdown;

    public RevenueReportDto() {
    }

    public RevenueReportDto(String period, BigDecimal grossRevenue, BigDecimal totalRefunds, BigDecimal netRevenue, BigDecimal roomRevenue, BigDecimal serviceRevenue, BigDecimal averageBookingValue, Map<String, BigDecimal> revenueByPaymentMethod, Map<String, BigDecimal> revenueByRoomType, List<DailyRevenueDto> dailyBreakdown) {
        this.period = period;
        this.grossRevenue = grossRevenue;
        this.totalRefunds = totalRefunds;
        this.netRevenue = netRevenue;
        this.roomRevenue = roomRevenue;
        this.serviceRevenue = serviceRevenue;
        this.averageBookingValue = averageBookingValue;
        this.revenueByPaymentMethod = revenueByPaymentMethod;
        this.revenueByRoomType = revenueByRoomType;
        this.dailyBreakdown = dailyBreakdown;
    }

    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }

    public BigDecimal getGrossRevenue() { return grossRevenue; }
    public void setGrossRevenue(BigDecimal grossRevenue) { this.grossRevenue = grossRevenue; }

    public BigDecimal getTotalRefunds() { return totalRefunds; }
    public void setTotalRefunds(BigDecimal totalRefunds) { this.totalRefunds = totalRefunds; }

    public BigDecimal getNetRevenue() { return netRevenue; }
    public void setNetRevenue(BigDecimal netRevenue) { this.netRevenue = netRevenue; }

    public BigDecimal getRoomRevenue() { return roomRevenue; }
    public void setRoomRevenue(BigDecimal roomRevenue) { this.roomRevenue = roomRevenue; }

    public BigDecimal getServiceRevenue() { return serviceRevenue; }
    public void setServiceRevenue(BigDecimal serviceRevenue) { this.serviceRevenue = serviceRevenue; }

    public BigDecimal getAverageBookingValue() { return averageBookingValue; }
    public void setAverageBookingValue(BigDecimal averageBookingValue) { this.averageBookingValue = averageBookingValue; }

    public Map<String, BigDecimal> getRevenueByPaymentMethod() { return revenueByPaymentMethod; }
    public void setRevenueByPaymentMethod(Map<String, BigDecimal> revenueByPaymentMethod) { this.revenueByPaymentMethod = revenueByPaymentMethod; }

    public Map<String, BigDecimal> getRevenueByRoomType() { return revenueByRoomType; }
    public void setRevenueByRoomType(Map<String, BigDecimal> revenueByRoomType) { this.revenueByRoomType = revenueByRoomType; }

    public List<DailyRevenueDto> getDailyBreakdown() { return dailyBreakdown; }
    public void setDailyBreakdown(List<DailyRevenueDto> dailyBreakdown) { this.dailyBreakdown = dailyBreakdown; }

    public static RevenueReportDtoBuilder builder() {
        return new RevenueReportDtoBuilder();
    }

    public static class RevenueReportDtoBuilder {
        private String period;
        private BigDecimal grossRevenue;
        private BigDecimal totalRefunds;
        private BigDecimal netRevenue;
        private BigDecimal roomRevenue;
        private BigDecimal serviceRevenue;
        private BigDecimal averageBookingValue;
        private Map<String, BigDecimal> revenueByPaymentMethod;
        private Map<String, BigDecimal> revenueByRoomType;
        private List<DailyRevenueDto> dailyBreakdown;

        public RevenueReportDtoBuilder period(String period) { this.period = period; return this; }
        public RevenueReportDtoBuilder grossRevenue(BigDecimal grossRevenue) { this.grossRevenue = grossRevenue; return this; }
        public RevenueReportDtoBuilder totalRefunds(BigDecimal totalRefunds) { this.totalRefunds = totalRefunds; return this; }
        public RevenueReportDtoBuilder netRevenue(BigDecimal netRevenue) { this.netRevenue = netRevenue; return this; }
        public RevenueReportDtoBuilder roomRevenue(BigDecimal roomRevenue) { this.roomRevenue = roomRevenue; return this; }
        public RevenueReportDtoBuilder serviceRevenue(BigDecimal serviceRevenue) { this.serviceRevenue = serviceRevenue; return this; }
        public RevenueReportDtoBuilder averageBookingValue(BigDecimal averageBookingValue) { this.averageBookingValue = averageBookingValue; return this; }
        public RevenueReportDtoBuilder revenueByPaymentMethod(Map<String, BigDecimal> revenueByPaymentMethod) { this.revenueByPaymentMethod = revenueByPaymentMethod; return this; }
        public RevenueReportDtoBuilder revenueByRoomType(Map<String, BigDecimal> revenueByRoomType) { this.revenueByRoomType = revenueByRoomType; return this; }
        public RevenueReportDtoBuilder dailyBreakdown(List<DailyRevenueDto> dailyBreakdown) { this.dailyBreakdown = dailyBreakdown; return this; }

        public RevenueReportDto build() {
            return new RevenueReportDto(period, grossRevenue, totalRefunds, netRevenue, roomRevenue, serviceRevenue, averageBookingValue, revenueByPaymentMethod, revenueByRoomType, dailyBreakdown);
        }
    }

    public static class DailyRevenueDto {
        private String date;
        private BigDecimal gross;
        private BigDecimal net;
        private BigDecimal refunds;

        public DailyRevenueDto() {
        }

        public DailyRevenueDto(String date, BigDecimal gross, BigDecimal net, BigDecimal refunds) {
            this.date = date;
            this.gross = gross;
            this.net = net;
            this.refunds = refunds;
        }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public BigDecimal getGross() { return gross; }
        public void setGross(BigDecimal gross) { this.gross = gross; }

        public BigDecimal getNet() { return net; }
        public void setNet(BigDecimal net) { this.net = net; }

        public BigDecimal getRefunds() { return refunds; }
        public void setRefunds(BigDecimal refunds) { this.refunds = refunds; }

        public static DailyRevenueDtoBuilder builder() {
            return new DailyRevenueDtoBuilder();
        }

        public static class DailyRevenueDtoBuilder {
            private String date;
            private BigDecimal gross;
            private BigDecimal net;
            private BigDecimal refunds;

            public DailyRevenueDtoBuilder date(String date) { this.date = date; return this; }
            public DailyRevenueDtoBuilder gross(BigDecimal gross) { this.gross = gross; return this; }
            public DailyRevenueDtoBuilder net(BigDecimal net) { this.net = net; return this; }
            public DailyRevenueDtoBuilder refunds(BigDecimal refunds) { this.refunds = refunds; return this; }

            public DailyRevenueDto build() {
                return new DailyRevenueDto(date, gross, net, refunds);
            }
        }
    }
}
