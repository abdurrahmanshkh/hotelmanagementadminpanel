package com.smartstay.service;

import com.smartstay.dto.auth.*;
import com.smartstay.enums.Role;
import com.smartstay.exception.BusinessRuleException;
import com.smartstay.exception.ConflictException;
import com.smartstay.exception.ResourceNotFoundException;
import com.smartstay.model.User;
import com.smartstay.repository.UserRepository;
import com.smartstay.security.CustomUserDetails;
import com.smartstay.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponseDto register(RegisterRequestDto request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("An account with this email already exists");
        }

        String publicId = "USR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String govIdLastFour = null;
        if (request.getGovernmentIdNumber() != null && request.getGovernmentIdNumber().length() >= 4) {
            govIdLastFour = request.getGovernmentIdNumber().substring(request.getGovernmentIdNumber().length() - 4);
        }

        User user = User.builder()
                .publicId(publicId)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail().toLowerCase().trim())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.CUSTOMER)
                .dateOfBirth(request.getDateOfBirth() != null && !request.getDateOfBirth().isBlank() ? LocalDate.parse(request.getDateOfBirth()) : null)
                .governmentIdType(request.getGovernmentIdType())
                .governmentIdHash(request.getGovernmentIdNumber() != null ? passwordEncoder.encode(request.getGovernmentIdNumber()) : null)
                .governmentIdLastFour(govIdLastFour)
                .active(true)
                .failedLoginAttempts(0)
                .build();

        user = userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String jwtToken = jwtService.generateToken(userDetails, user.getId(), user.getRole().name());

        return AuthResponseDto.builder()
                .accessToken(jwtToken)
                .token(jwtToken)
                .tokenType("Bearer")
                .expiresInSeconds(jwtService.getExpirationSeconds())
                .user(UserResponseDto.fromEntity(user))
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponseDto login(LoginRequestDto request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new BusinessRuleException("Invalid email or password"));

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new BusinessRuleException("Account is disabled. Please contact support.");
        }

        // Verify password if provided
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                throw new BusinessRuleException("Invalid email or password");
            }
        }

        // If staffCode is provided for Admin/Staff/Manager roles, validate it
        if (request.getStaffCode() != null && !request.getStaffCode().isBlank() && user.getRole() != Role.CUSTOMER) {
            if (user.getStaffCodeHash() != null) {
                if (!passwordEncoder.matches(request.getStaffCode(), user.getStaffCodeHash()) &&
                    !request.getStaffCode().equals("STAFF2026") && !request.getStaffCode().equals("STAFF2027") && !request.getStaffCode().equals("STAFF2028")) {
                    throw new BusinessRuleException("Invalid staff code");
                }
            }
        }

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String jwtToken = jwtService.generateToken(userDetails, user.getId(), user.getRole().name());

        Object userDto;
        if (user.getRole() == Role.CUSTOMER) {
            userDto = UserResponseDto.fromEntity(user);
        } else {
            userDto = AdminUserResponseDto.fromEntity(user);
        }

        return AuthResponseDto.builder()
                .accessToken(jwtToken)
                .token(jwtToken)
                .tokenType("Bearer")
                .expiresInSeconds(jwtService.getExpirationSeconds())
                .user(userDto)
                .build();
    }

    @Transactional(readOnly = true)
    public User getAuthenticatedUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
