package com.smartstay.dto.chat;

import com.smartstay.enums.ChatMode;
import com.smartstay.enums.ChatStatus;
import com.smartstay.model.ChatThread;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

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

    public ChatThreadDto() {
    }

    public ChatThreadDto(Long id, String threadReference, Long userId, Long guestId, String guestName, String guestEmail, Long bookingId, String roomNumber, ChatMode mode, ChatStatus status, Long assignedAdminId, String assignedAdminName, int unreadCount, int unreadCountCustomer, int unreadCountAdmin, String lastMessageText, String lastMessageAt, List<ChatMessageDto> messages, String createdAt, String updatedAt, String resolvedAt) {
        this.id = id;
        this.threadReference = threadReference;
        this.userId = userId;
        this.guestId = guestId;
        this.guestName = guestName;
        this.guestEmail = guestEmail;
        this.bookingId = bookingId;
        this.roomNumber = roomNumber;
        this.mode = mode;
        this.status = status;
        this.assignedAdminId = assignedAdminId;
        this.assignedAdminName = assignedAdminName;
        this.unreadCount = unreadCount;
        this.unreadCountCustomer = unreadCountCustomer;
        this.unreadCountAdmin = unreadCountAdmin;
        this.lastMessageText = lastMessageText;
        this.lastMessageAt = lastMessageAt;
        this.messages = messages;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.resolvedAt = resolvedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getThreadReference() { return threadReference; }
    public void setThreadReference(String threadReference) { this.threadReference = threadReference; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getGuestId() { return guestId; }
    public void setGuestId(Long guestId) { this.guestId = guestId; }

    public String getGuestName() { return guestName; }
    public void setGuestName(String guestName) { this.guestName = guestName; }

    public String getGuestEmail() { return guestEmail; }
    public void setGuestEmail(String guestEmail) { this.guestEmail = guestEmail; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public ChatMode getMode() { return mode; }
    public void setMode(ChatMode mode) { this.mode = mode; }

    public ChatStatus getStatus() { return status; }
    public void setStatus(ChatStatus status) { this.status = status; }

    public Long getAssignedAdminId() { return assignedAdminId; }
    public void setAssignedAdminId(Long assignedAdminId) { this.assignedAdminId = assignedAdminId; }

    public String getAssignedAdminName() { return assignedAdminName; }
    public void setAssignedAdminName(String assignedAdminName) { this.assignedAdminName = assignedAdminName; }

    public int getUnreadCount() { return unreadCount; }
    public void setUnreadCount(int unreadCount) { this.unreadCount = unreadCount; }

    public int getUnreadCountCustomer() { return unreadCountCustomer; }
    public void setUnreadCountCustomer(int unreadCountCustomer) { this.unreadCountCustomer = unreadCountCustomer; }

    public int getUnreadCountAdmin() { return unreadCountAdmin; }
    public void setUnreadCountAdmin(int unreadCountAdmin) { this.unreadCountAdmin = unreadCountAdmin; }

    public String getLastMessageText() { return lastMessageText; }
    public void setLastMessageText(String lastMessageText) { this.lastMessageText = lastMessageText; }

    public String getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(String lastMessageAt) { this.lastMessageAt = lastMessageAt; }

    public List<ChatMessageDto> getMessages() { return messages; }
    public void setMessages(List<ChatMessageDto> messages) { this.messages = messages; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

    public String getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(String resolvedAt) { this.resolvedAt = resolvedAt; }

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

    public static ChatThreadDtoBuilder builder() {
        return new ChatThreadDtoBuilder();
    }

    public static class ChatThreadDtoBuilder {
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

        public ChatThreadDtoBuilder id(Long id) { this.id = id; return this; }
        public ChatThreadDtoBuilder threadReference(String threadReference) { this.threadReference = threadReference; return this; }
        public ChatThreadDtoBuilder userId(Long userId) { this.userId = userId; return this; }
        public ChatThreadDtoBuilder guestId(Long guestId) { this.guestId = guestId; return this; }
        public ChatThreadDtoBuilder guestName(String guestName) { this.guestName = guestName; return this; }
        public ChatThreadDtoBuilder guestEmail(String guestEmail) { this.guestEmail = guestEmail; return this; }
        public ChatThreadDtoBuilder bookingId(Long bookingId) { this.bookingId = bookingId; return this; }
        public ChatThreadDtoBuilder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public ChatThreadDtoBuilder mode(ChatMode mode) { this.mode = mode; return this; }
        public ChatThreadDtoBuilder status(ChatStatus status) { this.status = status; return this; }
        public ChatThreadDtoBuilder assignedAdminId(Long assignedAdminId) { this.assignedAdminId = assignedAdminId; return this; }
        public ChatThreadDtoBuilder assignedAdminName(String assignedAdminName) { this.assignedAdminName = assignedAdminName; return this; }
        public ChatThreadDtoBuilder unreadCount(int unreadCount) { this.unreadCount = unreadCount; return this; }
        public ChatThreadDtoBuilder unreadCountCustomer(int unreadCountCustomer) { this.unreadCountCustomer = unreadCountCustomer; return this; }
        public ChatThreadDtoBuilder unreadCountAdmin(int unreadCountAdmin) { this.unreadCountAdmin = unreadCountAdmin; return this; }
        public ChatThreadDtoBuilder lastMessageText(String lastMessageText) { this.lastMessageText = lastMessageText; return this; }
        public ChatThreadDtoBuilder lastMessageAt(String lastMessageAt) { this.lastMessageAt = lastMessageAt; return this; }
        public ChatThreadDtoBuilder messages(List<ChatMessageDto> messages) { this.messages = messages; return this; }
        public ChatThreadDtoBuilder createdAt(String createdAt) { this.createdAt = createdAt; return this; }
        public ChatThreadDtoBuilder updatedAt(String updatedAt) { this.updatedAt = updatedAt; return this; }
        public ChatThreadDtoBuilder resolvedAt(String resolvedAt) { this.resolvedAt = resolvedAt; return this; }

        public ChatThreadDto build() {
            return new ChatThreadDto(id, threadReference, userId, guestId, guestName, guestEmail, bookingId, roomNumber, mode, status, assignedAdminId, assignedAdminName, unreadCount, unreadCountCustomer, unreadCountAdmin, lastMessageText, lastMessageAt, messages, createdAt, updatedAt, resolvedAt);
        }
    }
}
