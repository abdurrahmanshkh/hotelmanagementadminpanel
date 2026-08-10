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
public class UserResponseDto {

    private Long id;
    private String publicId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Role role;
    private String dateOfBirth;
    private String governmentIdType;
    private String governmentIdMasked;
    private boolean active;
    private String createdAt;
    private String updatedAt;

    public static UserResponseDto fromEntity(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .publicId(user.getPublicId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .dateOfBirth(user.getDateOfBirth() != null ? user.getDateOfBirth().toString() : null)
                .governmentIdType(user.getGovernmentIdType())
                .governmentIdMasked(user.getGovernmentIdMasked())
                .active(Boolean.TRUE.equals(user.getActive()))
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .updatedAt(user.getUpdatedAt() != null ? user.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .build();
    }
}
