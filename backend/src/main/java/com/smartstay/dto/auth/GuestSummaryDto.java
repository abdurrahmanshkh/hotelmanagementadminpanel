package com.smartstay.dto.auth;

import com.smartstay.model.User;

import java.time.format.DateTimeFormatter;

public class GuestSummaryDto {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private int totalBookings;
    private String currentStayRoom;
    private String lastStayDate;
    private String accountStatus; // ACTIVE, SUSPENDED
    private String createdAt;

    public GuestSummaryDto() {
    }

    public GuestSummaryDto(Long id, String fullName, String email, String phone, int totalBookings, String currentStayRoom, String lastStayDate, String accountStatus, String createdAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.totalBookings = totalBookings;
        this.currentStayRoom = currentStayRoom;
        this.lastStayDate = lastStayDate;
        this.accountStatus = accountStatus;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public int getTotalBookings() { return totalBookings; }
    public void setTotalBookings(int totalBookings) { this.totalBookings = totalBookings; }

    public String getCurrentStayRoom() { return currentStayRoom; }
    public void setCurrentStayRoom(String currentStayRoom) { this.currentStayRoom = currentStayRoom; }

    public String getLastStayDate() { return lastStayDate; }
    public void setLastStayDate(String lastStayDate) { this.lastStayDate = lastStayDate; }

    public String getAccountStatus() { return accountStatus; }
    public void setAccountStatus(String accountStatus) { this.accountStatus = accountStatus; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public static GuestSummaryDto fromUser(User user, int totalBookings, String currentRoom, String lastStayDate) {
        if (user == null) return null;
        return GuestSummaryDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .totalBookings(totalBookings)
                .currentStayRoom(currentRoom)
                .lastStayDate(lastStayDate)
                .accountStatus(Boolean.TRUE.equals(user.getActive()) ? "ACTIVE" : "SUSPENDED")
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .build();
    }

    public static GuestSummaryDtoBuilder builder() {
        return new GuestSummaryDtoBuilder();
    }

    public static class GuestSummaryDtoBuilder {
        private Long id;
        private String fullName;
        private String email;
        private String phone;
        private int totalBookings;
        private String currentStayRoom;
        private String lastStayDate;
        private String accountStatus;
        private String createdAt;

        public GuestSummaryDtoBuilder id(Long id) { this.id = id; return this; }
        public GuestSummaryDtoBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public GuestSummaryDtoBuilder email(String email) { this.email = email; return this; }
        public GuestSummaryDtoBuilder phone(String phone) { this.phone = phone; return this; }
        public GuestSummaryDtoBuilder totalBookings(int totalBookings) { this.totalBookings = totalBookings; return this; }
        public GuestSummaryDtoBuilder currentStayRoom(String currentStayRoom) { this.currentStayRoom = currentStayRoom; return this; }
        public GuestSummaryDtoBuilder lastStayDate(String lastStayDate) { this.lastStayDate = lastStayDate; return this; }
        public GuestSummaryDtoBuilder accountStatus(String accountStatus) { this.accountStatus = accountStatus; return this; }
        public GuestSummaryDtoBuilder createdAt(String createdAt) { this.createdAt = createdAt; return this; }

        public GuestSummaryDto build() {
            return new GuestSummaryDto(id, fullName, email, phone, totalBookings, currentStayRoom, lastStayDate, accountStatus, createdAt);
        }
    }
}
