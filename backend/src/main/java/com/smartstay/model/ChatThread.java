package com.smartstay.model;

import com.smartstay.enums.ChatMode;
import com.smartstay.enums.ChatStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chat_threads")
public class ChatThread {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "thread_reference", nullable = false, unique = true)
    private String threadReference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Enumerated(EnumType.STRING)
    @Column(name = "mode", nullable = false)
    private ChatMode mode = ChatMode.BOT;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ChatStatus status = ChatStatus.OPEN;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_admin_id")
    private User assignedAdmin;

    @Column(name = "last_message_text", length = 1000)
    private String lastMessageText;

    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;

    @Column(name = "unread_count_customer")
    private Integer unreadCountCustomer = 0;

    @Column(name = "unread_count_admin")
    private Integer unreadCountAdmin = 0;

    @OneToMany(mappedBy = "thread", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("createdAt ASC")
    private List<ChatMessage> messages = new ArrayList<>();

    @Column(name = "escalated_at")
    private LocalDateTime escalatedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public ChatThread() {
    }

    public ChatThread(Long id, String threadReference, User user, Booking booking, ChatMode mode, ChatStatus status, User assignedAdmin, String lastMessageText, LocalDateTime lastMessageAt, Integer unreadCountCustomer, Integer unreadCountAdmin, List<ChatMessage> messages, LocalDateTime escalatedAt, LocalDateTime resolvedAt, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.threadReference = threadReference;
        this.user = user;
        this.booking = booking;
        this.mode = mode != null ? mode : ChatMode.BOT;
        this.status = status != null ? status : ChatStatus.OPEN;
        this.assignedAdmin = assignedAdmin;
        this.lastMessageText = lastMessageText;
        this.lastMessageAt = lastMessageAt;
        this.unreadCountCustomer = unreadCountCustomer != null ? unreadCountCustomer : 0;
        this.unreadCountAdmin = unreadCountAdmin != null ? unreadCountAdmin : 0;
        this.messages = messages != null ? messages : new ArrayList<>();
        this.escalatedAt = escalatedAt;
        this.resolvedAt = resolvedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.lastMessageAt = LocalDateTime.now();
        if (this.mode == null) this.mode = ChatMode.BOT;
        if (this.status == null) this.status = ChatStatus.OPEN;
        if (this.unreadCountCustomer == null) this.unreadCountCustomer = 0;
        if (this.unreadCountAdmin == null) this.unreadCountAdmin = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getThreadReference() { return threadReference; }
    public void setThreadReference(String threadReference) { this.threadReference = threadReference; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public ChatMode getMode() { return mode; }
    public void setMode(ChatMode mode) { this.mode = mode; }

    public ChatStatus getStatus() { return status; }
    public void setStatus(ChatStatus status) { this.status = status; }

    public User getAssignedAdmin() { return assignedAdmin; }
    public void setAssignedAdmin(User assignedAdmin) { this.assignedAdmin = assignedAdmin; }

    public String getLastMessageText() { return lastMessageText; }
    public void setLastMessageText(String lastMessageText) { this.lastMessageText = lastMessageText; }

    public LocalDateTime getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(LocalDateTime lastMessageAt) { this.lastMessageAt = lastMessageAt; }

    public Integer getUnreadCountCustomer() { return unreadCountCustomer; }
    public void setUnreadCountCustomer(Integer unreadCountCustomer) { this.unreadCountCustomer = unreadCountCustomer; }

    public Integer getUnreadCountAdmin() { return unreadCountAdmin; }
    public void setUnreadCountAdmin(Integer unreadCountAdmin) { this.unreadCountAdmin = unreadCountAdmin; }

    public List<ChatMessage> getMessages() { return messages; }
    public void setMessages(List<ChatMessage> messages) { this.messages = messages; }

    public LocalDateTime getEscalatedAt() { return escalatedAt; }
    public void setEscalatedAt(LocalDateTime escalatedAt) { this.escalatedAt = escalatedAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static ChatThreadBuilder builder() {
        return new ChatThreadBuilder();
    }

    public static class ChatThreadBuilder {
        private Long id;
        private String threadReference;
        private User user;
        private Booking booking;
        private ChatMode mode = ChatMode.BOT;
        private ChatStatus status = ChatStatus.OPEN;
        private User assignedAdmin;
        private String lastMessageText;
        private LocalDateTime lastMessageAt;
        private Integer unreadCountCustomer = 0;
        private Integer unreadCountAdmin = 0;
        private List<ChatMessage> messages = new ArrayList<>();
        private LocalDateTime escalatedAt;
        private LocalDateTime resolvedAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public ChatThreadBuilder id(Long id) { this.id = id; return this; }
        public ChatThreadBuilder threadReference(String threadReference) { this.threadReference = threadReference; return this; }
        public ChatThreadBuilder user(User user) { this.user = user; return this; }
        public ChatThreadBuilder booking(Booking booking) { this.booking = booking; return this; }
        public ChatThreadBuilder mode(ChatMode mode) { this.mode = mode; return this; }
        public ChatThreadBuilder status(ChatStatus status) { this.status = status; return this; }
        public ChatThreadBuilder assignedAdmin(User assignedAdmin) { this.assignedAdmin = assignedAdmin; return this; }
        public ChatThreadBuilder lastMessageText(String lastMessageText) { this.lastMessageText = lastMessageText; return this; }
        public ChatThreadBuilder lastMessageAt(LocalDateTime lastMessageAt) { this.lastMessageAt = lastMessageAt; return this; }
        public ChatThreadBuilder unreadCountCustomer(Integer unreadCountCustomer) { this.unreadCountCustomer = unreadCountCustomer; return this; }
        public ChatThreadBuilder unreadCountAdmin(Integer unreadCountAdmin) { this.unreadCountAdmin = unreadCountAdmin; return this; }
        public ChatThreadBuilder messages(List<ChatMessage> messages) { this.messages = messages; return this; }
        public ChatThreadBuilder escalatedAt(LocalDateTime escalatedAt) { this.escalatedAt = escalatedAt; return this; }
        public ChatThreadBuilder resolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; return this; }
        public ChatThreadBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ChatThreadBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public ChatThread build() {
            return new ChatThread(id, threadReference, user, booking, mode, status, assignedAdmin, lastMessageText, lastMessageAt, unreadCountCustomer, unreadCountAdmin, messages, escalatedAt, resolvedAt, createdAt, updatedAt);
        }
    }
}
