package com.smartstay.dto.report;

import java.util.Map;

public class ServiceReportDto {
    private String period;
    private int totalRequests;
    private int completedRequests;
    private int cancelledRequests;
    private double averageResponseTimeMinutes;
    private double averageCompletionTimeMinutes;
    private Map<String, Integer> requestsByCategory;
    private Map<String, Integer> requestsByPriority;

    public ServiceReportDto() {
    }

    public ServiceReportDto(String period, int totalRequests, int completedRequests, int cancelledRequests, double averageResponseTimeMinutes, double averageCompletionTimeMinutes, Map<String, Integer> requestsByCategory, Map<String, Integer> requestsByPriority) {
        this.period = period;
        this.totalRequests = totalRequests;
        this.completedRequests = completedRequests;
        this.cancelledRequests = cancelledRequests;
        this.averageResponseTimeMinutes = averageResponseTimeMinutes;
        this.averageCompletionTimeMinutes = averageCompletionTimeMinutes;
        this.requestsByCategory = requestsByCategory;
        this.requestsByPriority = requestsByPriority;
    }

    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }

    public int getTotalRequests() { return totalRequests; }
    public void setTotalRequests(int totalRequests) { this.totalRequests = totalRequests; }

    public int getCompletedRequests() { return completedRequests; }
    public void setCompletedRequests(int completedRequests) { this.completedRequests = completedRequests; }

    public int getCancelledRequests() { return cancelledRequests; }
    public void setCancelledRequests(int cancelledRequests) { this.cancelledRequests = cancelledRequests; }

    public double getAverageResponseTimeMinutes() { return averageResponseTimeMinutes; }
    public void setAverageResponseTimeMinutes(double averageResponseTimeMinutes) { this.averageResponseTimeMinutes = averageResponseTimeMinutes; }

    public double getAverageCompletionTimeMinutes() { return averageCompletionTimeMinutes; }
    public void setAverageCompletionTimeMinutes(double averageCompletionTimeMinutes) { this.averageCompletionTimeMinutes = averageCompletionTimeMinutes; }

    public Map<String, Integer> getRequestsByCategory() { return requestsByCategory; }
    public void setRequestsByCategory(Map<String, Integer> requestsByCategory) { this.requestsByCategory = requestsByCategory; }

    public Map<String, Integer> getRequestsByPriority() { return requestsByPriority; }
    public void setRequestsByPriority(Map<String, Integer> requestsByPriority) { this.requestsByPriority = requestsByPriority; }

    public static ServiceReportDtoBuilder builder() {
        return new ServiceReportDtoBuilder();
    }

    public static class ServiceReportDtoBuilder {
        private String period;
        private int totalRequests;
        private int completedRequests;
        private int cancelledRequests;
        private double averageResponseTimeMinutes;
        private double averageCompletionTimeMinutes;
        private Map<String, Integer> requestsByCategory;
        private Map<String, Integer> requestsByPriority;

        public ServiceReportDtoBuilder period(String period) { this.period = period; return this; }
        public ServiceReportDtoBuilder totalRequests(int totalRequests) { this.totalRequests = totalRequests; return this; }
        public ServiceReportDtoBuilder completedRequests(int completedRequests) { this.completedRequests = completedRequests; return this; }
        public ServiceReportDtoBuilder cancelledRequests(int cancelledRequests) { this.cancelledRequests = cancelledRequests; return this; }
        public ServiceReportDtoBuilder averageResponseTimeMinutes(double averageResponseTimeMinutes) { this.averageResponseTimeMinutes = averageResponseTimeMinutes; return this; }
        public ServiceReportDtoBuilder averageCompletionTimeMinutes(double averageCompletionTimeMinutes) { this.averageCompletionTimeMinutes = averageCompletionTimeMinutes; return this; }
        public ServiceReportDtoBuilder requestsByCategory(Map<String, Integer> requestsByCategory) { this.requestsByCategory = requestsByCategory; return this; }
        public ServiceReportDtoBuilder requestsByPriority(Map<String, Integer> requestsByPriority) { this.requestsByPriority = requestsByPriority; return this; }

        public ServiceReportDto build() {
            return new ServiceReportDto(period, totalRequests, completedRequests, cancelledRequests, averageResponseTimeMinutes, averageCompletionTimeMinutes, requestsByCategory, requestsByPriority);
        }
    }
}
