package com.smartstay.dto.auth;

import com.smartstay.enums.Role;
import com.smartstay.model.User;

import java.time.format.DateTimeFormatter;

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

    public UserResponseDto() {
    }

    public UserResponseDto(Long id, String publicId, String firstName, String lastName, String email, String phone, Role role, String dateOfBirth, String governmentIdType, String governmentIdMasked, boolean active, String createdAt, String updatedAt) {
        this.id = id;
        this.publicId = publicId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.dateOfBirth = dateOfBirth;
        this.governmentIdType = governmentIdType;
        this.governmentIdMasked = governmentIdMasked;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPublicId() { return publicId; }
    public void setPublicId(String publicId) { this.publicId = publicId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getGovernmentIdType() { return governmentIdType; }
    public void setGovernmentIdType(String governmentIdType) { this.governmentIdType = governmentIdType; }

    public String getGovernmentIdMasked() { return governmentIdMasked; }
    public void setGovernmentIdMasked(String governmentIdMasked) { this.governmentIdMasked = governmentIdMasked; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

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

    public static UserResponseDtoBuilder builder() {
        return new UserResponseDtoBuilder();
    }

    public static class UserResponseDtoBuilder {
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

        public UserResponseDtoBuilder id(Long id) { this.id = id; return this; }
        public UserResponseDtoBuilder publicId(String publicId) { this.publicId = publicId; return this; }
        public UserResponseDtoBuilder firstName(String firstName) { this.firstName = firstName; return this; }
        public UserResponseDtoBuilder lastName(String lastName) { this.lastName = lastName; return this; }
        public UserResponseDtoBuilder email(String email) { this.email = email; return this; }
        public UserResponseDtoBuilder phone(String phone) { this.phone = phone; return this; }
        public UserResponseDtoBuilder role(Role role) { this.role = role; return this; }
        public UserResponseDtoBuilder dateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; return this; }
        public UserResponseDtoBuilder governmentIdType(String governmentIdType) { this.governmentIdType = governmentIdType; return this; }
        public UserResponseDtoBuilder governmentIdMasked(String governmentIdMasked) { this.governmentIdMasked = governmentIdMasked; return this; }
        public UserResponseDtoBuilder active(boolean active) { this.active = active; return this; }
        public UserResponseDtoBuilder createdAt(String createdAt) { this.createdAt = createdAt; return this; }
        public UserResponseDtoBuilder updatedAt(String updatedAt) { this.updatedAt = updatedAt; return this; }

        public UserResponseDto build() {
            return new UserResponseDto(id, publicId, firstName, lastName, email, phone, role, dateOfBirth, governmentIdType, governmentIdMasked, active, createdAt, updatedAt);
        }
    }
}
