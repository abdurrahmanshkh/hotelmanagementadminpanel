package com.smartstay.dto.report;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

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

    public OccupancyReportDto() {
    }

    public OccupancyReportDto(String period, double averageOccupancyPercentage, double peakOccupancyPercentage, double lowestOccupancyPercentage, int maintenanceImpactDays, BigDecimal averageDailyRate, BigDecimal revPar, Map<String, Double> occupancyByRoomType, List<DailyOccupancyDto> dailyBreakdown) {
        this.period = period;
        this.averageOccupancyPercentage = averageOccupancyPercentage;
        this.peakOccupancyPercentage = peakOccupancyPercentage;
        this.lowestOccupancyPercentage = lowestOccupancyPercentage;
        this.maintenanceImpactDays = maintenanceImpactDays;
        this.averageDailyRate = averageDailyRate;
        this.revPar = revPar;
        this.occupancyByRoomType = occupancyByRoomType;
        this.dailyBreakdown = dailyBreakdown;
    }

    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }

    public double getAverageOccupancyPercentage() { return averageOccupancyPercentage; }
    public void setAverageOccupancyPercentage(double averageOccupancyPercentage) { this.averageOccupancyPercentage = averageOccupancyPercentage; }

    public double getPeakOccupancyPercentage() { return peakOccupancyPercentage; }
    public void setPeakOccupancyPercentage(double peakOccupancyPercentage) { this.peakOccupancyPercentage = peakOccupancyPercentage; }

    public double getLowestOccupancyPercentage() { return lowestOccupancyPercentage; }
    public void setLowestOccupancyPercentage(double lowestOccupancyPercentage) { this.lowestOccupancyPercentage = lowestOccupancyPercentage; }

    public int getMaintenanceImpactDays() { return maintenanceImpactDays; }
    public void setMaintenanceImpactDays(int maintenanceImpactDays) { this.maintenanceImpactDays = maintenanceImpactDays; }

    public BigDecimal getAverageDailyRate() { return averageDailyRate; }
    public void setAverageDailyRate(BigDecimal averageDailyRate) { this.averageDailyRate = averageDailyRate; }

    public BigDecimal getRevPar() { return revPar; }
    public void setRevPar(BigDecimal revPar) { this.revPar = revPar; }

    public Map<String, Double> getOccupancyByRoomType() { return occupancyByRoomType; }
    public void setOccupancyByRoomType(Map<String, Double> occupancyByRoomType) { this.occupancyByRoomType = occupancyByRoomType; }

    public List<DailyOccupancyDto> getDailyBreakdown() { return dailyBreakdown; }
    public void setDailyBreakdown(List<DailyOccupancyDto> dailyBreakdown) { this.dailyBreakdown = dailyBreakdown; }

    public static OccupancyReportDtoBuilder builder() {
        return new OccupancyReportDtoBuilder();
    }

    public static class OccupancyReportDtoBuilder {
        private String period;
        private double averageOccupancyPercentage;
        private double peakOccupancyPercentage;
        private double lowestOccupancyPercentage;
        private int maintenanceImpactDays;
        private BigDecimal averageDailyRate;
        private BigDecimal revPar;
        private Map<String, Double> occupancyByRoomType;
        private List<DailyOccupancyDto> dailyBreakdown;

        public OccupancyReportDtoBuilder period(String period) { this.period = period; return this; }
        public OccupancyReportDtoBuilder averageOccupancyPercentage(double averageOccupancyPercentage) { this.averageOccupancyPercentage = averageOccupancyPercentage; return this; }
        public OccupancyReportDtoBuilder peakOccupancyPercentage(double peakOccupancyPercentage) { this.peakOccupancyPercentage = peakOccupancyPercentage; return this; }
        public OccupancyReportDtoBuilder lowestOccupancyPercentage(double lowestOccupancyPercentage) { this.lowestOccupancyPercentage = lowestOccupancyPercentage; return this; }
        public OccupancyReportDtoBuilder maintenanceImpactDays(int maintenanceImpactDays) { this.maintenanceImpactDays = maintenanceImpactDays; return this; }
        public OccupancyReportDtoBuilder averageDailyRate(BigDecimal averageDailyRate) { this.averageDailyRate = averageDailyRate; return this; }
        public OccupancyReportDtoBuilder revPar(BigDecimal revPar) { this.revPar = revPar; return this; }
        public OccupancyReportDtoBuilder occupancyByRoomType(Map<String, Double> occupancyByRoomType) { this.occupancyByRoomType = occupancyByRoomType; return this; }
        public OccupancyReportDtoBuilder dailyBreakdown(List<DailyOccupancyDto> dailyBreakdown) { this.dailyBreakdown = dailyBreakdown; return this; }

        public OccupancyReportDto build() {
            return new OccupancyReportDto(period, averageOccupancyPercentage, peakOccupancyPercentage, lowestOccupancyPercentage, maintenanceImpactDays, averageDailyRate, revPar, occupancyByRoomType, dailyBreakdown);
        }
    }

    public static class DailyOccupancyDto {
        private String date;
        private double occupancyPercentage;
        private int occupiedCount;

        public DailyOccupancyDto() {
        }

        public DailyOccupancyDto(String date, double occupancyPercentage, int occupiedCount) {
            this.date = date;
            this.occupancyPercentage = occupancyPercentage;
            this.occupiedCount = occupiedCount;
        }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public double getOccupancyPercentage() { return occupancyPercentage; }
        public void setOccupancyPercentage(double occupancyPercentage) { this.occupancyPercentage = occupancyPercentage; }

        public int getOccupiedCount() { return occupiedCount; }
        public void setOccupiedCount(int occupiedCount) { this.occupiedCount = occupiedCount; }

        public static DailyOccupancyDtoBuilder builder() {
            return new DailyOccupancyDtoBuilder();
        }

        public static class DailyOccupancyDtoBuilder {
            private String date;
            private double occupancyPercentage;
            private int occupiedCount;

            public DailyOccupancyDtoBuilder date(String date) { this.date = date; return this; }
            public DailyOccupancyDtoBuilder occupancyPercentage(double occupancyPercentage) { this.occupancyPercentage = occupancyPercentage; return this; }
            public DailyOccupancyDtoBuilder occupiedCount(int occupiedCount) { this.occupiedCount = occupiedCount; return this; }

            public DailyOccupancyDto build() {
                return new DailyOccupancyDto(date, occupancyPercentage, occupiedCount);
            }
        }
    }
}
