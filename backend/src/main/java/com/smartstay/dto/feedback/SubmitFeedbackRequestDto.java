package com.smartstay.dto.feedback;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

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

    public SubmitFeedbackRequestDto() {
    }

    public SubmitFeedbackRequestDto(Long bookingId, int rating, Integer cleanlinessRating, Integer serviceRating, Integer comfortRating, String comments) {
        this.bookingId = bookingId;
        this.rating = rating;
        this.cleanlinessRating = cleanlinessRating;
        this.serviceRating = serviceRating;
        this.comfortRating = comfortRating;
        this.comments = comments;
    }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public Integer getCleanlinessRating() { return cleanlinessRating; }
    public void setCleanlinessRating(Integer cleanlinessRating) { this.cleanlinessRating = cleanlinessRating; }

    public Integer getServiceRating() { return serviceRating; }
    public void setServiceRating(Integer serviceRating) { this.serviceRating = serviceRating; }

    public Integer getComfortRating() { return comfortRating; }
    public void setComfortRating(Integer comfortRating) { this.comfortRating = comfortRating; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
}
