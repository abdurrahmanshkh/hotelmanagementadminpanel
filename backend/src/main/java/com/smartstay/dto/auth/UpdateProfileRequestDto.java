package com.smartstay.dto.auth;

public class UpdateProfileRequestDto {
    private String firstName;
    private String lastName;
    private String phone;
    private String dateOfBirth;
    private String governmentIdType;
    private String governmentIdNumber;

    public UpdateProfileRequestDto() {
    }

    public UpdateProfileRequestDto(String firstName, String lastName, String phone, String dateOfBirth, String governmentIdType, String governmentIdNumber) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.dateOfBirth = dateOfBirth;
        this.governmentIdType = governmentIdType;
        this.governmentIdNumber = governmentIdNumber;
    }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getGovernmentIdType() { return governmentIdType; }
    public void setGovernmentIdType(String governmentIdType) { this.governmentIdType = governmentIdType; }

    public String getGovernmentIdNumber() { return governmentIdNumber; }
    public void setGovernmentIdNumber(String governmentIdNumber) { this.governmentIdNumber = governmentIdNumber; }
}
