package com.smartstay.dto.chat;

import com.smartstay.model.ChatMessage;

import java.time.format.DateTimeFormatter;

public class ChatMessageDto {

    private Long id;
    private Long threadId;
    private String senderType; // CUSTOMER, BOT, ADMIN, SYSTEM
    private Long senderId;
    private String senderName;
    private String content;
    private String messageText;
    private boolean isRead;
    private String sentAt;
    private String createdAt;

    public ChatMessageDto() {
    }

    public ChatMessageDto(Long id, Long threadId, String senderType, Long senderId, String senderName, String content, String messageText, boolean isRead, String sentAt, String createdAt) {
        this.id = id;
        this.threadId = threadId;
        this.senderType = senderType;
        this.senderId = senderId;
        this.senderName = senderName;
        this.content = content;
        this.messageText = messageText;
        this.isRead = isRead;
        this.sentAt = sentAt;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getThreadId() { return threadId; }
    public void setThreadId(Long threadId) { this.threadId = threadId; }

    public String getSenderType() { return senderType; }
    public void setSenderType(String senderType) { this.senderType = senderType; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getMessageText() { return messageText; }
    public void setMessageText(String messageText) { this.messageText = messageText; }

    public boolean isRead() { return isRead; }
    public boolean getIsRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public String getSentAt() { return sentAt; }
    public void setSentAt(String sentAt) { this.sentAt = sentAt; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public static ChatMessageDto fromEntity(ChatMessage m) {
        if (m == null) return null;
        return ChatMessageDto.builder()
                .id(m.getId())
                .threadId(m.getThread() != null ? m.getThread().getId() : null)
                .senderType(m.getSenderType())
                .senderId(m.getSenderId())
                .senderName(m.getSenderName() != null ? m.getSenderName() : m.getSenderType())
                .content(m.getContent())
                .messageText(m.getContent())
                .isRead(Boolean.TRUE.equals(m.getIsRead()))
                .sentAt(m.getCreatedAt() != null ? m.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .createdAt(m.getCreatedAt() != null ? m.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .build();
    }

    public static ChatMessageDtoBuilder builder() {
        return new ChatMessageDtoBuilder();
    }

    public static class ChatMessageDtoBuilder {
        private Long id;
        private Long threadId;
        private String senderType;
        private Long senderId;
        private String senderName;
        private String content;
        private String messageText;
        private boolean isRead;
        private String sentAt;
        private String createdAt;

        public ChatMessageDtoBuilder id(Long id) { this.id = id; return this; }
        public ChatMessageDtoBuilder threadId(Long threadId) { this.threadId = threadId; return this; }
        public ChatMessageDtoBuilder senderType(String senderType) { this.senderType = senderType; return this; }
        public ChatMessageDtoBuilder senderId(Long senderId) { this.senderId = senderId; return this; }
        public ChatMessageDtoBuilder senderName(String senderName) { this.senderName = senderName; return this; }
        public ChatMessageDtoBuilder content(String content) { this.content = content; return this; }
        public ChatMessageDtoBuilder messageText(String messageText) { this.messageText = messageText; return this; }
        public ChatMessageDtoBuilder isRead(boolean isRead) { this.isRead = isRead; return this; }
        public ChatMessageDtoBuilder sentAt(String sentAt) { this.sentAt = sentAt; return this; }
        public ChatMessageDtoBuilder createdAt(String createdAt) { this.createdAt = createdAt; return this; }

        public ChatMessageDto build() {
            return new ChatMessageDto(id, threadId, senderType, senderId, senderName, content, messageText, isRead, sentAt, createdAt);
        }
    }
}
