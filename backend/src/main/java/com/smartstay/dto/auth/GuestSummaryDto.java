package com.smartstay.dto.auth;

import com.smartstay.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
}
