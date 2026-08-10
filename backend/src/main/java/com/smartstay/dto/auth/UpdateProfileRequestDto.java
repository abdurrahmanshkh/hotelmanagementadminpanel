package com.smartstay.dto.auth;

import lombok.Data;

@Data
public class UpdateProfileRequestDto {
    private String firstName;
    private String lastName;
    private String phone;
    private String dateOfBirth;
    private String governmentIdType;
    private String governmentIdNumber;
}
