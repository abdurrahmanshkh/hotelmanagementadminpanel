package com.smartstay.dto.chat;

import com.smartstay.model.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
}
