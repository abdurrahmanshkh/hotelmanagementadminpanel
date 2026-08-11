package com.smartstay.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class NotificationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "message", nullable = false, length = 1000)
    private String message;

    @Column(name = "is_read", nullable = false)
    private Boolean read = false;

    @Column(name = "link_url")
    private String linkUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public NotificationEntity() {
    }

    public NotificationEntity(Long id, User user, String type, String title, String message, Boolean read, String linkUrl, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.type = type;
        this.title = title;
        this.message = message;
        this.read = read != null ? read : false;
        this.linkUrl = linkUrl;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.read == null) this.read = false;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Boolean getRead() { return read; }
    public Boolean isRead() { return read; }
    public void setRead(Boolean read) { this.read = read; }

    public String getLinkUrl() { return linkUrl; }
    public void setLinkUrl(String linkUrl) { this.linkUrl = linkUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static NotificationEntityBuilder builder() {
        return new NotificationEntityBuilder();
    }

    public static class NotificationEntityBuilder {
        private Long id;
        private User user;
        private String type;
        private String title;
        private String message;
        private Boolean read = false;
        private String linkUrl;
        private LocalDateTime createdAt;

        public NotificationEntityBuilder id(Long id) { this.id = id; return this; }
        public NotificationEntityBuilder user(User user) { this.user = user; return this; }
        public NotificationEntityBuilder type(String type) { this.type = type; return this; }
        public NotificationEntityBuilder title(String title) { this.title = title; return this; }
        public NotificationEntityBuilder message(String message) { this.message = message; return this; }
        public NotificationEntityBuilder read(Boolean read) { this.read = read; return this; }
        public NotificationEntityBuilder linkUrl(String linkUrl) { this.linkUrl = linkUrl; return this; }
        public NotificationEntityBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public NotificationEntity build() {
            return new NotificationEntity(id, user, type, title, message, read, linkUrl, createdAt);
        }
    }
}
