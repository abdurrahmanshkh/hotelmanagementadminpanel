package com.smartstay.dto.notification;

import com.smartstay.model.NotificationEntity;

import java.time.format.DateTimeFormatter;

public class NotificationDto {

    private Long id;
    private Long userId;
    private String type;
    private String title;
    private String message;
    private boolean read;
    private String linkUrl;
    private String createdAt;

    public NotificationDto() {
    }

    public NotificationDto(Long id, Long userId, String type, String title, String message, boolean read, String linkUrl, String createdAt) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.title = title;
        this.message = message;
        this.read = read;
        this.linkUrl = linkUrl;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }

    public String getLinkUrl() { return linkUrl; }
    public void setLinkUrl(String linkUrl) { this.linkUrl = linkUrl; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public static NotificationDto fromEntity(NotificationEntity n) {
        if (n == null) return null;
        return NotificationDto.builder()
                .id(n.getId())
                .userId(n.getUser() != null ? n.getUser().getId() : null)
                .type(n.getType())
                .title(n.getTitle())
                .message(n.getMessage())
                .read(Boolean.TRUE.equals(n.getRead()))
                .linkUrl(n.getLinkUrl())
                .createdAt(n.getCreatedAt() != null ? n.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .build();
    }

    public static NotificationDtoBuilder builder() {
        return new NotificationDtoBuilder();
    }

    public static class NotificationDtoBuilder {
        private Long id;
        private Long userId;
        private String type;
        private String title;
        private String message;
        private boolean read;
        private String linkUrl;
        private String createdAt;

        public NotificationDtoBuilder id(Long id) { this.id = id; return this; }
        public NotificationDtoBuilder userId(Long userId) { this.userId = userId; return this; }
        public NotificationDtoBuilder type(String type) { this.type = type; return this; }
        public NotificationDtoBuilder title(String title) { this.title = title; return this; }
        public NotificationDtoBuilder message(String message) { this.message = message; return this; }
        public NotificationDtoBuilder read(boolean read) { this.read = read; return this; }
        public NotificationDtoBuilder linkUrl(String linkUrl) { this.linkUrl = linkUrl; return this; }
        public NotificationDtoBuilder createdAt(String createdAt) { this.createdAt = createdAt; return this; }

        public NotificationDto build() {
            return new NotificationDto(id, userId, type, title, message, read, linkUrl, createdAt);
        }
    }
}
