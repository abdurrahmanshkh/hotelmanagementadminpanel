package com.smartstay.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thread_id", nullable = false)
    private ChatThread thread;

    @Column(name = "sender_type", nullable = false)
    private String senderType; // CUSTOMER, BOT, ADMIN, SYSTEM

    @Column(name = "sender_id")
    private Long senderId;

    @Column(name = "sender_name")
    private String senderName;

    @Column(name = "content", nullable = false, length = 2000)
    private String content;

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public ChatMessage() {
    }

    public ChatMessage(Long id, ChatThread thread, String senderType, Long senderId, String senderName, String content, Boolean isRead, LocalDateTime createdAt) {
        this.id = id;
        this.thread = thread;
        this.senderType = senderType;
        this.senderId = senderId;
        this.senderName = senderName;
        this.content = content;
        this.isRead = isRead != null ? isRead : false;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.isRead == null) {
            this.isRead = false;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ChatThread getThread() {
        return thread;
    }

    public void setThread(ChatThread thread) {
        this.thread = thread;
    }

    public String getSenderType() {
        return senderType;
    }

    public void setSenderType(String senderType) {
        this.senderType = senderType;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static ChatMessageBuilder builder() {
        return new ChatMessageBuilder();
    }

    public static class ChatMessageBuilder {
        private Long id;
        private ChatThread thread;
        private String senderType;
        private Long senderId;
        private String senderName;
        private String content;
        private Boolean isRead = false;
        private LocalDateTime createdAt;

        public ChatMessageBuilder id(Long id) { this.id = id; return this; }
        public ChatMessageBuilder thread(ChatThread thread) { this.thread = thread; return this; }
        public ChatMessageBuilder senderType(String senderType) { this.senderType = senderType; return this; }
        public ChatMessageBuilder senderId(Long senderId) { this.senderId = senderId; return this; }
        public ChatMessageBuilder senderName(String senderName) { this.senderName = senderName; return this; }
        public ChatMessageBuilder content(String content) { this.content = content; return this; }
        public ChatMessageBuilder isRead(Boolean isRead) { this.isRead = isRead; return this; }
        public ChatMessageBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ChatMessage build() {
            return new ChatMessage(id, thread, senderType, senderId, senderName, content, isRead, createdAt);
        }
    }
}
