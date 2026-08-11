package com.smartstay.model;

import com.smartstay.enums.Role;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "public_id", unique = true, nullable = false)
    private String publicId;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "government_id_type")
    private String governmentIdType;

    @Column(name = "government_id_hash")
    private String governmentIdHash;

    @Column(name = "government_id_last_four")
    private String governmentIdLastFour;

    @Column(name = "staff_code_hash")
    private String staffCodeHash;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @Column(name = "failed_login_attempts")
    private Integer failedLoginAttempts = 0;

    @Column(name = "locked_until")
    private LocalDateTime lockedUntil;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public User() {
    }

    public User(Long id, String publicId, String firstName, String lastName, String email, String phone, String passwordHash, Role role, LocalDate dateOfBirth, String governmentIdType, String governmentIdHash, String governmentIdLastFour, String staffCodeHash, Boolean active, Integer failedLoginAttempts, LocalDateTime lockedUntil, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.publicId = publicId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.passwordHash = passwordHash;
        this.role = role;
        this.dateOfBirth = dateOfBirth;
        this.governmentIdType = governmentIdType;
        this.governmentIdHash = governmentIdHash;
        this.governmentIdLastFour = governmentIdLastFour;
        this.staffCodeHash = staffCodeHash;
        this.active = active != null ? active : true;
        this.failedLoginAttempts = failedLoginAttempts != null ? failedLoginAttempts : 0;
        this.lockedUntil = lockedUntil;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.active == null) this.active = true;
        if (this.failedLoginAttempts == null) this.failedLoginAttempts = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
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

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getGovernmentIdType() { return governmentIdType; }
    public void setGovernmentIdType(String governmentIdType) { this.governmentIdType = governmentIdType; }

    public String getGovernmentIdHash() { return governmentIdHash; }
    public void setGovernmentIdHash(String governmentIdHash) { this.governmentIdHash = governmentIdHash; }

    public String getGovernmentIdLastFour() { return governmentIdLastFour; }
    public void setGovernmentIdLastFour(String governmentIdLastFour) { this.governmentIdLastFour = governmentIdLastFour; }

    public String getStaffCodeHash() { return staffCodeHash; }
    public void setStaffCodeHash(String staffCodeHash) { this.staffCodeHash = staffCodeHash; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public Integer getFailedLoginAttempts() { return failedLoginAttempts; }
    public void setFailedLoginAttempts(Integer failedLoginAttempts) { this.failedLoginAttempts = failedLoginAttempts; }

    public LocalDateTime getLockedUntil() { return lockedUntil; }
    public void setLockedUntil(LocalDateTime lockedUntil) { this.lockedUntil = lockedUntil; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getFullName() {
        return firstName + " " + lastName;
    }

    public String getGovernmentIdMasked() {
        if (governmentIdLastFour != null && !governmentIdLastFour.isBlank()) {
            return "XXXXXXXX" + governmentIdLastFour;
        }
        return null;
    }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private Long id;
        private String publicId;
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private String passwordHash;
        private Role role;
        private LocalDate dateOfBirth;
        private String governmentIdType;
        private String governmentIdHash;
        private String governmentIdLastFour;
        private String staffCodeHash;
        private Boolean active = true;
        private Integer failedLoginAttempts = 0;
        private LocalDateTime lockedUntil;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public UserBuilder id(Long id) { this.id = id; return this; }
        public UserBuilder publicId(String publicId) { this.publicId = publicId; return this; }
        public UserBuilder firstName(String firstName) { this.firstName = firstName; return this; }
        public UserBuilder lastName(String lastName) { this.lastName = lastName; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder phone(String phone) { this.phone = phone; return this; }
        public UserBuilder passwordHash(String passwordHash) { this.passwordHash = passwordHash; return this; }
        public UserBuilder role(Role role) { this.role = role; return this; }
        public UserBuilder dateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; return this; }
        public UserBuilder governmentIdType(String governmentIdType) { this.governmentIdType = governmentIdType; return this; }
        public UserBuilder governmentIdHash(String governmentIdHash) { this.governmentIdHash = governmentIdHash; return this; }
        public UserBuilder governmentIdLastFour(String governmentIdLastFour) { this.governmentIdLastFour = governmentIdLastFour; return this; }
        public UserBuilder staffCodeHash(String staffCodeHash) { this.staffCodeHash = staffCodeHash; return this; }
        public UserBuilder active(Boolean active) { this.active = active; return this; }
        public UserBuilder failedLoginAttempts(Integer failedLoginAttempts) { this.failedLoginAttempts = failedLoginAttempts; return this; }
        public UserBuilder lockedUntil(LocalDateTime lockedUntil) { this.lockedUntil = lockedUntil; return this; }
        public UserBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public UserBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public User build() {
            return new User(id, publicId, firstName, lastName, email, phone, passwordHash, role, dateOfBirth, governmentIdType, governmentIdHash, governmentIdLastFour, staffCodeHash, active, failedLoginAttempts, lockedUntil, createdAt, updatedAt);
        }
    }
}
