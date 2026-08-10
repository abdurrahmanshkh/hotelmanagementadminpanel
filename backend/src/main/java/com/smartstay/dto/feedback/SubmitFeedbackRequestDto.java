package com.smartstay.dto.feedback;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubmitFeedbackRequestDto {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private int rating;

    private Integer cleanlinessRating;
    private Integer serviceRating;
    private Integer comfortRating;
    private String comments;
}
