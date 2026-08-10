package com.smartstay.dto.booking;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingQuoteRequestDto {

    @NotNull(message = "Room ID is required")
    private Long roomId;

    @NotBlank(message = "Check-in date is required")
    private String checkInDate;

    @NotBlank(message = "Check-out date is required")
    private String checkOutDate;

    @Min(value = 1, message = "At least 1 adult is required")
    private int adults = 1;

    private int children = 0;
}
