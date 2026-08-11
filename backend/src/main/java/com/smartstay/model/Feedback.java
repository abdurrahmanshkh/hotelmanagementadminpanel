package com.smartstay.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Column(name = "cleanliness_rating")
    private Integer cleanlinessRating;

    @Column(name = "service_rating")
    private Integer serviceRating;

    @Column(name = "comfort_rating")
    private Integer comfortRating;

    @Column(name = "comments", length = 1000)
    private String comments;

    @Column(name = "visible", nullable = false)
    private Boolean visible = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Feedback() {
    }

    public Feedback(Long id, Booking booking, User user, Integer rating, Integer cleanlinessRating, Integer serviceRating, Integer comfortRating, String comments, Boolean visible, LocalDateTime createdAt) {
        this.id = id;
        this.booking = booking;
        this.user = user;
        this.rating = rating;
        this.cleanlinessRating = cleanlinessRating;
        this.serviceRating = serviceRating;
        this.comfortRating = comfortRating;
        this.comments = comments;
        this.visible = visible != null ? visible : true;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.visible == null) this.visible = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public Integer getCleanlinessRating() { return cleanlinessRating; }
    public void setCleanlinessRating(Integer cleanlinessRating) { this.cleanlinessRating = cleanlinessRating; }

    public Integer getServiceRating() { return serviceRating; }
    public void setServiceRating(Integer serviceRating) { this.serviceRating = serviceRating; }

    public Integer getComfortRating() { return comfortRating; }
    public void setComfortRating(Integer comfortRating) { this.comfortRating = comfortRating; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public Boolean getVisible() { return visible; }
    public void setVisible(Boolean visible) { this.visible = visible; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static FeedbackBuilder builder() {
        return new FeedbackBuilder();
    }

    public static class FeedbackBuilder {
        private Long id;
        private Booking booking;
        private User user;
        private Integer rating;
        private Integer cleanlinessRating;
        private Integer serviceRating;
        private Integer comfortRating;
        private String comments;
        private Boolean visible = true;
        private LocalDateTime createdAt;

        public FeedbackBuilder id(Long id) { this.id = id; return this; }
        public FeedbackBuilder booking(Booking booking) { this.booking = booking; return this; }
        public FeedbackBuilder user(User user) { this.user = user; return this; }
        public FeedbackBuilder rating(Integer rating) { this.rating = rating; return this; }
        public FeedbackBuilder cleanlinessRating(Integer cleanlinessRating) { this.cleanlinessRating = cleanlinessRating; return this; }
        public FeedbackBuilder serviceRating(Integer serviceRating) { this.serviceRating = serviceRating; return this; }
        public FeedbackBuilder comfortRating(Integer comfortRating) { this.comfortRating = comfortRating; return this; }
        public FeedbackBuilder comments(String comments) { this.comments = comments; return this; }
        public FeedbackBuilder visible(Boolean visible) { this.visible = visible; return this; }
        public FeedbackBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Feedback build() {
            return new Feedback(id, booking, user, rating, cleanlinessRating, serviceRating, comfortRating, comments, visible, createdAt);
        }
    }
}
