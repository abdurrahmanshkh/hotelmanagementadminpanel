package com.smartstay.dto.auth;

import com.smartstay.dto.booking.BookingDto;
import com.smartstay.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
}
