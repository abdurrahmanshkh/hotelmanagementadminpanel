package com.smartstay.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingActivityDto {
    private Long id;
    private Long bookingId;
    private String action;
    private String performedBy;
    private String timestamp;
    private String notes;
}
