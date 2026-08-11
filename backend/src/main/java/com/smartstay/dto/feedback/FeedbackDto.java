package com.smartstay.dto.feedback;

import com.smartstay.model.Feedback;

import java.time.format.DateTimeFormatter;

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

    public FeedbackDto() {
    }

    public FeedbackDto(Long id, Long bookingId, String bookingReference, Long userId, String guestName, String roomNumber, int rating, Integer cleanlinessRating, Integer serviceRating, Integer comfortRating, String comments, boolean visible, String createdAt) {
        this.id = id;
        this.bookingId = bookingId;
        this.bookingReference = bookingReference;
        this.userId = userId;
        this.guestName = guestName;
        this.roomNumber = roomNumber;
        this.rating = rating;
        this.cleanlinessRating = cleanlinessRating;
        this.serviceRating = serviceRating;
        this.comfortRating = comfortRating;
        this.comments = comments;
        this.visible = visible;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getGuestName() { return guestName; }
    public void setGuestName(String guestName) { this.guestName = guestName; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

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

    public boolean isVisible() { return visible; }
    public void setVisible(boolean visible) { this.visible = visible; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

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

    public static FeedbackDtoBuilder builder() {
        return new FeedbackDtoBuilder();
    }

    public static class FeedbackDtoBuilder {
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

        public FeedbackDtoBuilder id(Long id) { this.id = id; return this; }
        public FeedbackDtoBuilder bookingId(Long bookingId) { this.bookingId = bookingId; return this; }
        public FeedbackDtoBuilder bookingReference(String bookingReference) { this.bookingReference = bookingReference; return this; }
        public FeedbackDtoBuilder userId(Long userId) { this.userId = userId; return this; }
        public FeedbackDtoBuilder guestName(String guestName) { this.guestName = guestName; return this; }
        public FeedbackDtoBuilder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public FeedbackDtoBuilder rating(int rating) { this.rating = rating; return this; }
        public FeedbackDtoBuilder cleanlinessRating(Integer cleanlinessRating) { this.cleanlinessRating = cleanlinessRating; return this; }
        public FeedbackDtoBuilder serviceRating(Integer serviceRating) { this.serviceRating = serviceRating; return this; }
        public FeedbackDtoBuilder comfortRating(Integer comfortRating) { this.comfortRating = comfortRating; return this; }
        public FeedbackDtoBuilder comments(String comments) { this.comments = comments; return this; }
        public FeedbackDtoBuilder visible(boolean visible) { this.visible = visible; return this; }
        public FeedbackDtoBuilder createdAt(String createdAt) { this.createdAt = createdAt; return this; }

        public FeedbackDto build() {
            return new FeedbackDto(id, bookingId, bookingReference, userId, guestName, roomNumber, rating, cleanlinessRating, serviceRating, comfortRating, comments, visible, createdAt);
        }
    }
}
