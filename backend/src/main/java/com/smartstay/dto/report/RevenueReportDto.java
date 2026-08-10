package com.smartstay.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyRevenueDto {
        private String date;
        private BigDecimal gross;
        private BigDecimal net;
        private BigDecimal refunds;
    }
}
