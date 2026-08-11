package com.smartstay.dto.auth;

import com.smartstay.enums.Role;
import com.smartstay.model.User;

import java.time.format.DateTimeFormatter;

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

    public AdminUserResponseDto() {
    }

    public AdminUserResponseDto(Long id, String email, String fullName, Role role, String staffCode, String phone, String avatarUrl, String createdAt, String lastLoginAt) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.staffCode = staffCode;
        this.phone = phone;
        this.avatarUrl = avatarUrl;
        this.createdAt = createdAt;
        this.lastLoginAt = lastLoginAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getStaffCode() { return staffCode; }
    public void setStaffCode(String staffCode) { this.staffCode = staffCode; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(String lastLoginAt) { this.lastLoginAt = lastLoginAt; }

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

    public static AdminUserResponseDtoBuilder builder() {
        return new AdminUserResponseDtoBuilder();
    }

    public static class AdminUserResponseDtoBuilder {
        private Long id;
        private String email;
        private String fullName;
        private Role role;
        private String staffCode;
        private String phone;
        private String avatarUrl;
        private String createdAt;
        private String lastLoginAt;

        public AdminUserResponseDtoBuilder id(Long id) { this.id = id; return this; }
        public AdminUserResponseDtoBuilder email(String email) { this.email = email; return this; }
        public AdminUserResponseDtoBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public AdminUserResponseDtoBuilder role(Role role) { this.role = role; return this; }
        public AdminUserResponseDtoBuilder staffCode(String staffCode) { this.staffCode = staffCode; return this; }
        public AdminUserResponseDtoBuilder phone(String phone) { this.phone = phone; return this; }
        public AdminUserResponseDtoBuilder avatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; return this; }
        public AdminUserResponseDtoBuilder createdAt(String createdAt) { this.createdAt = createdAt; return this; }
        public AdminUserResponseDtoBuilder lastLoginAt(String lastLoginAt) { this.lastLoginAt = lastLoginAt; return this; }

        public AdminUserResponseDto build() {
            return new AdminUserResponseDto(id, email, fullName, role, staffCode, phone, avatarUrl, createdAt, lastLoginAt);
        }
    }
}
