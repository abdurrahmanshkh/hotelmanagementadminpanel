package com.smartstay.dto.chat;

import com.smartstay.enums.ChatMode;
import com.smartstay.enums.ChatStatus;
import com.smartstay.model.ChatThread;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatThreadDto {

    private Long id;
    private String threadReference;
    private Long userId;
    private Long guestId;
    private String guestName;
    private String guestEmail;
    private Long bookingId;
    private String roomNumber;
    private ChatMode mode;
    private ChatStatus status;
    private Long assignedAdminId;
    private String assignedAdminName;
    private int unreadCount;
    private int unreadCountCustomer;
    private int unreadCountAdmin;
    private String lastMessageText;
    private String lastMessageAt;
    private List<ChatMessageDto> messages;
    private String createdAt;
    private String updatedAt;
    private String resolvedAt;

    public static ChatThreadDto fromEntity(ChatThread t) {
        if (t == null) return null;

        String gName = t.getUser() != null ? t.getUser().getFullName() : "Guest";
        String gEmail = t.getUser() != null ? t.getUser().getEmail() : "";
        String rNum = (t.getBooking() != null && t.getBooking().getRoom() != null) ? t.getBooking().getRoom().getRoomNumber() : null;
        String adminName = t.getAssignedAdmin() != null ? t.getAssignedAdmin().getFullName() : null;

        List<ChatMessageDto> msgDtos = t.getMessages() != null
                ? t.getMessages().stream().map(ChatMessageDto::fromEntity).collect(Collectors.toList())
                : List.of();

        return ChatThreadDto.builder()
                .id(t.getId())
                .threadReference(t.getThreadReference())
                .userId(t.getUser() != null ? t.getUser().getId() : null)
                .guestId(t.getUser() != null ? t.getUser().getId() : null)
                .guestName(gName)
                .guestEmail(gEmail)
                .bookingId(t.getBooking() != null ? t.getBooking().getId() : null)
                .roomNumber(rNum)
                .mode(t.getMode())
                .status(t.getStatus())
                .assignedAdminId(t.getAssignedAdmin() != null ? t.getAssignedAdmin().getId() : null)
                .assignedAdminName(adminName)
                .unreadCount(t.getUnreadCountCustomer() != null ? t.getUnreadCountCustomer() : 0)
                .unreadCountCustomer(t.getUnreadCountCustomer() != null ? t.getUnreadCountCustomer() : 0)
                .unreadCountAdmin(t.getUnreadCountAdmin() != null ? t.getUnreadCountAdmin() : 0)
                .lastMessageText(t.getLastMessageText())
                .lastMessageAt(t.getLastMessageAt() != null ? t.getLastMessageAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .messages(msgDtos)
                .createdAt(t.getCreatedAt() != null ? t.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .updatedAt(t.getUpdatedAt() != null ? t.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .resolvedAt(t.getResolvedAt() != null ? t.getResolvedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .build();
    }
}
