package com.smartstay.dto.dashboard;

import com.smartstay.dto.booking.BookingDto;
import com.smartstay.dto.chat.ChatThreadDto;
import com.smartstay.dto.service.ServiceRequestDto;
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
public class DashboardSummaryDto {

    private Map<String, Integer> roomCounters;
    private List<BookingDto> arrivals;
    private List<BookingDto> departures;
    private List<ServiceRequestDto> urgentServiceRequests;
    private List<ChatThreadDto> waitingChats;
    private double occupancyPercentage;
    private BigDecimal todayRevenue;
    private BigDecimal monthlyRevenue;
    private int totalRooms;
    private int availableRooms;
    private int occupiedRooms;
    private int reservedRooms;
    private int maintenanceRooms;
    private int todayCheckIns;
    private int todayCheckOuts;
    private int pendingServiceRequests;
    private int waitingChatThreads;
    private String currency;
}
