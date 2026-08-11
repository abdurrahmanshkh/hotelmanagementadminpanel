package com.smartstay.dto.auth;

import com.smartstay.dto.booking.BookingDto;
import com.smartstay.model.User;

import java.time.format.DateTimeFormatter;
import java.util.List;

public class GuestDetailsDto {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private int totalBookings;
    private String currentStayRoom;
    private String lastStayDate;
    private String accountStatus;
    private String maskedIdType;
    private String maskedIdNumber;
    private String emergencyContact;
    private String notes;
    private List<BookingDto> stayHistory;
    private String createdAt;

    public GuestDetailsDto() {
    }

    public GuestDetailsDto(Long id, String fullName, String email, String phone, int totalBookings, String currentStayRoom, String lastStayDate, String accountStatus, String maskedIdType, String maskedIdNumber, String emergencyContact, String notes, List<BookingDto> stayHistory, String createdAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.totalBookings = totalBookings;
        this.currentStayRoom = currentStayRoom;
        this.lastStayDate = lastStayDate;
        this.accountStatus = accountStatus;
        this.maskedIdType = maskedIdType;
        this.maskedIdNumber = maskedIdNumber;
        this.emergencyContact = emergencyContact;
        this.notes = notes;
        this.stayHistory = stayHistory;
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

    public String getMaskedIdType() { return maskedIdType; }
    public void setMaskedIdType(String maskedIdType) { this.maskedIdType = maskedIdType; }

    public String getMaskedIdNumber() { return maskedIdNumber; }
    public void setMaskedIdNumber(String maskedIdNumber) { this.maskedIdNumber = maskedIdNumber; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<BookingDto> getStayHistory() { return stayHistory; }
    public void setStayHistory(List<BookingDto> stayHistory) { this.stayHistory = stayHistory; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public static GuestDetailsDto fromUser(User user, List<BookingDto> history, String currentRoom, String lastStayDate) {
        if (user == null) return null;
        return GuestDetailsDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .totalBookings(history != null ? history.size() : 0)
                .currentStayRoom(currentRoom)
                .lastStayDate(lastStayDate)
                .accountStatus(Boolean.TRUE.equals(user.getActive()) ? "ACTIVE" : "SUSPENDED")
                .maskedIdType(user.getGovernmentIdType())
                .maskedIdNumber(user.getGovernmentIdMasked())
                .stayHistory(history != null ? history : List.of())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .build();
    }

    public static GuestDetailsDtoBuilder builder() {
        return new GuestDetailsDtoBuilder();
    }

    public static class GuestDetailsDtoBuilder {
        private Long id;
        private String fullName;
        private String email;
        private String phone;
        private int totalBookings;
        private String currentStayRoom;
        private String lastStayDate;
        private String accountStatus;
        private String maskedIdType;
        private String maskedIdNumber;
        private String emergencyContact;
        private String notes;
        private List<BookingDto> stayHistory;
        private String createdAt;

        public GuestDetailsDtoBuilder id(Long id) { this.id = id; return this; }
        public GuestDetailsDtoBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public GuestDetailsDtoBuilder email(String email) { this.email = email; return this; }
        public GuestDetailsDtoBuilder phone(String phone) { this.phone = phone; return this; }
        public GuestDetailsDtoBuilder totalBookings(int totalBookings) { this.totalBookings = totalBookings; return this; }
        public GuestDetailsDtoBuilder currentStayRoom(String currentStayRoom) { this.currentStayRoom = currentStayRoom; return this; }
        public GuestDetailsDtoBuilder lastStayDate(String lastStayDate) { this.lastStayDate = lastStayDate; return this; }
        public GuestDetailsDtoBuilder accountStatus(String accountStatus) { this.accountStatus = accountStatus; return this; }
        public GuestDetailsDtoBuilder maskedIdType(String maskedIdType) { this.maskedIdType = maskedIdType; return this; }
        public GuestDetailsDtoBuilder maskedIdNumber(String maskedIdNumber) { this.maskedIdNumber = maskedIdNumber; return this; }
        public GuestDetailsDtoBuilder emergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; return this; }
        public GuestDetailsDtoBuilder notes(String notes) { this.notes = notes; return this; }
        public GuestDetailsDtoBuilder stayHistory(List<BookingDto> stayHistory) { this.stayHistory = stayHistory; return this; }
        public GuestDetailsDtoBuilder createdAt(String createdAt) { this.createdAt = createdAt; return this; }

        public GuestDetailsDto build() {
            return new GuestDetailsDto(id, fullName, email, phone, totalBookings, currentStayRoom, lastStayDate, accountStatus, maskedIdType, maskedIdNumber, emergencyContact, notes, stayHistory, createdAt);
        }
    }
}
