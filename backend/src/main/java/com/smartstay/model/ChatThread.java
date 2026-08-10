package com.smartstay.model;

import com.smartstay.enums.ChatMode;
import com.smartstay.enums.ChatStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chat_threads")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    @Builder.Default
    private ChatMode mode = ChatMode.BOT;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private ChatStatus status = ChatStatus.OPEN;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_admin_id")
    private User assignedAdmin;

    @Column(name = "last_message_text", length = 1000)
    private String lastMessageText;

    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;

    @Column(name = "unread_count_customer")
    @Builder.Default
    private Integer unreadCountCustomer = 0;

    @Column(name = "unread_count_admin")
    @Builder.Default
    private Integer unreadCountAdmin = 0;

    @OneToMany(mappedBy = "thread", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("createdAt ASC")
    @Builder.Default
    private List<ChatMessage> messages = new ArrayList<>();

    @Column(name = "escalated_at")
    private LocalDateTime escalatedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

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
}
