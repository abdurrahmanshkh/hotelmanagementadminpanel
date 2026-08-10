package com.smartstay.dto.feedback;

import com.smartstay.model.Feedback;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackDto {

    private Long id;
    private Long bookingId;
    private String bookingReference;
    private Long userId;
    private String guestName;
    private String roomNumber;
    private int rating;
    private Integer cleanlinessRating;
    private Integer serviceRating;
    private Integer comfortRating;
    private String comments;
    private boolean visible;
    private String createdAt;

    public static FeedbackDto fromEntity(Feedback f) {
        if (f == null) return null;

        String bRef = f.getBooking() != null ? f.getBooking().getBookingReference() : "";
        String gName = f.getUser() != null ? f.getUser().getFullName() : "Guest";
        String rNum = (f.getBooking() != null && f.getBooking().getRoom() != null) ? f.getBooking().getRoom().getRoomNumber() : "";

        return FeedbackDto.builder()
                .id(f.getId())
                .bookingId(f.getBooking() != null ? f.getBooking().getId() : null)
                .bookingReference(bRef)
                .userId(f.getUser() != null ? f.getUser().getId() : null)
                .guestName(gName)
                .roomNumber(rNum)
                .rating(f.getRating() != null ? f.getRating() : 5)
                .cleanlinessRating(f.getCleanlinessRating())
                .serviceRating(f.getServiceRating())
                .comfortRating(f.getComfortRating())
                .comments(f.getComments())
                .visible(Boolean.TRUE.equals(f.getVisible()))
                .createdAt(f.getCreatedAt() != null ? f.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .build();
    }
}
