package com.smartstay.dto.dashboard;

import com.smartstay.dto.booking.BookingDto;
import com.smartstay.dto.chat.ChatThreadDto;
import com.smartstay.dto.service.ServiceRequestDto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

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

    public DashboardSummaryDto() {
    }

    public DashboardSummaryDto(Map<String, Integer> roomCounters, List<BookingDto> arrivals, List<BookingDto> departures, List<ServiceRequestDto> urgentServiceRequests, List<ChatThreadDto> waitingChats, double occupancyPercentage, BigDecimal todayRevenue, BigDecimal monthlyRevenue, int totalRooms, int availableRooms, int occupiedRooms, int reservedRooms, int maintenanceRooms, int todayCheckIns, int todayCheckOuts, int pendingServiceRequests, int waitingChatThreads, String currency) {
        this.roomCounters = roomCounters;
        this.arrivals = arrivals;
        this.departures = departures;
        this.urgentServiceRequests = urgentServiceRequests;
        this.waitingChats = waitingChats;
        this.occupancyPercentage = occupancyPercentage;
        this.todayRevenue = todayRevenue;
        this.monthlyRevenue = monthlyRevenue;
        this.totalRooms = totalRooms;
        this.availableRooms = availableRooms;
        this.occupiedRooms = occupiedRooms;
        this.reservedRooms = reservedRooms;
        this.maintenanceRooms = maintenanceRooms;
        this.todayCheckIns = todayCheckIns;
        this.todayCheckOuts = todayCheckOuts;
        this.pendingServiceRequests = pendingServiceRequests;
        this.waitingChatThreads = waitingChatThreads;
        this.currency = currency;
    }

    public Map<String, Integer> getRoomCounters() { return roomCounters; }
    public void setRoomCounters(Map<String, Integer> roomCounters) { this.roomCounters = roomCounters; }

    public List<BookingDto> getArrivals() { return arrivals; }
    public void setArrivals(List<BookingDto> arrivals) { this.arrivals = arrivals; }

    public List<BookingDto> getDepartures() { return departures; }
    public void setDepartures(List<BookingDto> departures) { this.departures = departures; }

    public List<ServiceRequestDto> getUrgentServiceRequests() { return urgentServiceRequests; }
    public void setUrgentServiceRequests(List<ServiceRequestDto> urgentServiceRequests) { this.urgentServiceRequests = urgentServiceRequests; }

    public List<ChatThreadDto> getWaitingChats() { return waitingChats; }
    public void setWaitingChats(List<ChatThreadDto> waitingChats) { this.waitingChats = waitingChats; }

    public double getOccupancyPercentage() { return occupancyPercentage; }
    public void setOccupancyPercentage(double occupancyPercentage) { this.occupancyPercentage = occupancyPercentage; }

    public BigDecimal getTodayRevenue() { return todayRevenue; }
    public void setTodayRevenue(BigDecimal todayRevenue) { this.todayRevenue = todayRevenue; }

    public BigDecimal getMonthlyRevenue() { return monthlyRevenue; }
    public void setMonthlyRevenue(BigDecimal monthlyRevenue) { this.monthlyRevenue = monthlyRevenue; }

    public int getTotalRooms() { return totalRooms; }
    public void setTotalRooms(int totalRooms) { this.totalRooms = totalRooms; }

    public int getAvailableRooms() { return availableRooms; }
    public void setAvailableRooms(int availableRooms) { this.availableRooms = availableRooms; }

    public int getOccupiedRooms() { return occupiedRooms; }
    public void setOccupiedRooms(int occupiedRooms) { this.occupiedRooms = occupiedRooms; }

    public int getReservedRooms() { return reservedRooms; }
    public void setReservedRooms(int reservedRooms) { this.reservedRooms = reservedRooms; }

    public int getMaintenanceRooms() { return maintenanceRooms; }
    public void setMaintenanceRooms(int maintenanceRooms) { this.maintenanceRooms = maintenanceRooms; }

    public int getTodayCheckIns() { return todayCheckIns; }
    public void setTodayCheckIns(int todayCheckIns) { this.todayCheckIns = todayCheckIns; }

    public int getTodayCheckOuts() { return todayCheckOuts; }
    public void setTodayCheckOuts(int todayCheckOuts) { this.todayCheckOuts = todayCheckOuts; }

    public int getPendingServiceRequests() { return pendingServiceRequests; }
    public void setPendingServiceRequests(int pendingServiceRequests) { this.pendingServiceRequests = pendingServiceRequests; }

    public int getWaitingChatThreads() { return waitingChatThreads; }
    public void setWaitingChatThreads(int waitingChatThreads) { this.waitingChatThreads = waitingChatThreads; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public static DashboardSummaryDtoBuilder builder() {
        return new DashboardSummaryDtoBuilder();
    }

    public static class DashboardSummaryDtoBuilder {
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

        public DashboardSummaryDtoBuilder roomCounters(Map<String, Integer> roomCounters) { this.roomCounters = roomCounters; return this; }
        public DashboardSummaryDtoBuilder arrivals(List<BookingDto> arrivals) { this.arrivals = arrivals; return this; }
        public DashboardSummaryDtoBuilder departures(List<BookingDto> departures) { this.departures = departures; return this; }
        public DashboardSummaryDtoBuilder urgentServiceRequests(List<ServiceRequestDto> urgentServiceRequests) { this.urgentServiceRequests = urgentServiceRequests; return this; }
        public DashboardSummaryDtoBuilder waitingChats(List<ChatThreadDto> waitingChats) { this.waitingChats = waitingChats; return this; }
        public DashboardSummaryDtoBuilder occupancyPercentage(double occupancyPercentage) { this.occupancyPercentage = occupancyPercentage; return this; }
        public DashboardSummaryDtoBuilder todayRevenue(BigDecimal todayRevenue) { this.todayRevenue = todayRevenue; return this; }
        public DashboardSummaryDtoBuilder monthlyRevenue(BigDecimal monthlyRevenue) { this.monthlyRevenue = monthlyRevenue; return this; }
        public DashboardSummaryDtoBuilder totalRooms(int totalRooms) { this.totalRooms = totalRooms; return this; }
        public DashboardSummaryDtoBuilder availableRooms(int availableRooms) { this.availableRooms = availableRooms; return this; }
        public DashboardSummaryDtoBuilder occupiedRooms(int occupiedRooms) { this.occupiedRooms = occupiedRooms; return this; }
        public DashboardSummaryDtoBuilder reservedRooms(int reservedRooms) { this.reservedRooms = reservedRooms; return this; }
        public DashboardSummaryDtoBuilder maintenanceRooms(int maintenanceRooms) { this.maintenanceRooms = maintenanceRooms; return this; }
        public DashboardSummaryDtoBuilder todayCheckIns(int todayCheckIns) { this.todayCheckIns = todayCheckIns; return this; }
        public DashboardSummaryDtoBuilder todayCheckOuts(int todayCheckOuts) { this.todayCheckOuts = todayCheckOuts; return this; }
        public DashboardSummaryDtoBuilder pendingServiceRequests(int pendingServiceRequests) { this.pendingServiceRequests = pendingServiceRequests; return this; }
        public DashboardSummaryDtoBuilder waitingChatThreads(int waitingChatThreads) { this.waitingChatThreads = waitingChatThreads; return this; }
        public DashboardSummaryDtoBuilder currency(String currency) { this.currency = currency; return this; }

        public DashboardSummaryDto build() {
            return new DashboardSummaryDto(roomCounters, arrivals, departures, urgentServiceRequests, waitingChats, occupancyPercentage, todayRevenue, monthlyRevenue, totalRooms, availableRooms, occupiedRooms, reservedRooms, maintenanceRooms, todayCheckIns, todayCheckOuts, pendingServiceRequests, waitingChatThreads, currency);
        }
    }
}
