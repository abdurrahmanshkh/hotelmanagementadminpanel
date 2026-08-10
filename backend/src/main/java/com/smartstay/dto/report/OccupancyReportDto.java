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
public class OccupancyReportDto {
    private String period;
    private double averageOccupancyPercentage;
    private double peakOccupancyPercentage;
    private double lowestOccupancyPercentage;
    private int maintenanceImpactDays;
    private BigDecimal averageDailyRate;
    private BigDecimal revPar;
    private Map<String, Double> occupancyByRoomType;
    private List<DailyOccupancyDto> dailyBreakdown;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyOccupancyDto {
        private String date;
        private double occupancyPercentage;
        private int occupiedCount;
    }
}
