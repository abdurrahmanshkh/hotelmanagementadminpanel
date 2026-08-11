package com.smartstay.dto.service;

import com.smartstay.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateServiceRequestDto {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private Priority priority = Priority.MEDIUM;

    public CreateServiceRequestDto() {
    }

    public CreateServiceRequestDto(Long bookingId, String category, String title, String description, Priority priority) {
        this.bookingId = bookingId;
        this.category = category;
        this.title = title;
        this.description = description;
        this.priority = priority != null ? priority : Priority.MEDIUM;
    }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
}
