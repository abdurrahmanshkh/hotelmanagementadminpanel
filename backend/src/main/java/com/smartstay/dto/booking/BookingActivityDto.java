package com.smartstay.dto.booking;

public class BookingActivityDto {
    private Long id;
    private Long bookingId;
    private String action;
    private String performedBy;
    private String timestamp;
    private String notes;

    public BookingActivityDto() {
    }

    public BookingActivityDto(Long id, Long bookingId, String action, String performedBy, String timestamp, String notes) {
        this.id = id;
        this.bookingId = bookingId;
        this.action = action;
        this.performedBy = performedBy;
        this.timestamp = timestamp;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public static BookingActivityDtoBuilder builder() {
        return new BookingActivityDtoBuilder();
    }

    public static class BookingActivityDtoBuilder {
        private Long id;
        private Long bookingId;
        private String action;
        private String performedBy;
        private String timestamp;
        private String notes;

        public BookingActivityDtoBuilder id(Long id) { this.id = id; return this; }
        public BookingActivityDtoBuilder bookingId(Long bookingId) { this.bookingId = bookingId; return this; }
        public BookingActivityDtoBuilder action(String action) { this.action = action; return this; }
        public BookingActivityDtoBuilder performedBy(String performedBy) { this.performedBy = performedBy; return this; }
        public BookingActivityDtoBuilder timestamp(String timestamp) { this.timestamp = timestamp; return this; }
        public BookingActivityDtoBuilder notes(String notes) { this.notes = notes; return this; }

        public BookingActivityDto build() {
            return new BookingActivityDto(id, bookingId, action, performedBy, timestamp, notes);
        }
    }
}
