package com.smartstay.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceReportDto {
    private String period;
    private int totalRequests;
    private int completedRequests;
    private int cancelledRequests;
    private double averageResponseTimeMinutes;
    private double averageCompletionTimeMinutes;
    private Map<String, Integer> requestsByCategory;
    private Map<String, Integer> requestsByPriority;
}
