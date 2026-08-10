package com.smartstay.dto.auth;

import com.smartstay.enums.Role;
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
public class AdminUserResponseDto {

    private Long id;
    private String email;
    private String fullName;
    private Role role;
    private String staffCode;
    private String phone;
    private String avatarUrl;
    private String createdAt;
    private String lastLoginAt;

    public static AdminUserResponseDto fromEntity(User user) {
        return AdminUserResponseDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .staffCode(user.getStaffCodeHash() != null ? "STAFF_SET" : null)
                .phone(user.getPhone())
                .avatarUrl("https://ui-avatars.com/api/?name=" + user.getFirstName() + "+" + user.getLastName())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .lastLoginAt(user.getUpdatedAt() != null ? user.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .build();
    }
}
