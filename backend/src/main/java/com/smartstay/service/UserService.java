package com.smartstay.service;

import com.smartstay.dto.auth.UpdateProfileRequestDto;
import com.smartstay.dto.auth.UserResponseDto;
import com.smartstay.exception.ResourceNotFoundException;
import com.smartstay.model.User;
import com.smartstay.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponseDto updateProfile(Long userId, UpdateProfileRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (request.getFirstName() != null && !request.getFirstName().isBlank()) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null && !request.getLastName().isBlank()) {
            user.setLastName(request.getLastName());
        }
        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            user.setPhone(request.getPhone());
        }
        if (request.getDateOfBirth() != null && !request.getDateOfBirth().isBlank()) {
            user.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));
        }
        if (request.getGovernmentIdType() != null && !request.getGovernmentIdType().isBlank()) {
            user.setGovernmentIdType(request.getGovernmentIdType());
        }
        if (request.getGovernmentIdNumber() != null && !request.getGovernmentIdNumber().isBlank()) {
            user.setGovernmentIdHash(passwordEncoder.encode(request.getGovernmentIdNumber()));
            if (request.getGovernmentIdNumber().length() >= 4) {
                user.setGovernmentIdLastFour(request.getGovernmentIdNumber().substring(request.getGovernmentIdNumber().length() - 4));
            }
        }

        user = userRepository.save(user);
        return UserResponseDto.fromEntity(user);
    }
}
