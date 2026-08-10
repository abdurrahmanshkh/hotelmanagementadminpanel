package com.smartstay.service;

import com.smartstay.dto.chat.ChatMessageDto;
import com.smartstay.dto.chat.ChatThreadDto;
import com.smartstay.dto.common.PageData;
import com.smartstay.enums.ChatMode;
import com.smartstay.enums.ChatStatus;
import com.smartstay.exception.BusinessRuleException;
import com.smartstay.exception.ResourceNotFoundException;
import com.smartstay.model.Booking;
import com.smartstay.model.ChatMessage;
import com.smartstay.model.ChatThread;
import com.smartstay.model.User;
import com.smartstay.repository.BookingRepository;
import com.smartstay.repository.ChatMessageRepository;
import com.smartstay.repository.ChatThreadRepository;
import com.smartstay.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatThreadRepository threadRepository;
    private final ChatMessageRepository messageRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Transactional
    public ChatThreadDto createThread(User user, Long bookingId, String initialMessage, ChatMode mode) {
        Booking booking = null;
        if (bookingId != null) {
            booking = bookingRepository.findById(bookingId).orElse(null);
        }

        String refCode = "CHT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        ChatThread thread = ChatThread.builder()
                .threadReference(refCode)
                .user(user)
                .booking(booking)
                .mode(mode != null ? mode : ChatMode.BOT)
                .status(ChatStatus.OPEN)
                .lastMessageText(initialMessage)
                .lastMessageAt(LocalDateTime.now())
                .unreadCountCustomer(0)
                .unreadCountAdmin(1)
                .build();

        thread = threadRepository.save(thread);

        if (initialMessage != null && !initialMessage.isBlank()) {
            ChatMessage msg = ChatMessage.builder()
                    .thread(thread)
                    .senderType("CUSTOMER")
                    .senderId(user.getId())
                    .senderName(user.getFullName())
                    .content(initialMessage)
                    .isRead(false)
                    .build();
            messageRepository.save(msg);
        }

        return ChatThreadDto.fromEntity(thread);
    }

    @Transactional(readOnly = true)
    public List<ChatThreadDto> getCustomerThreads(Long userId) {
        return threadRepository.findByUserIdOrderByLastMessageAtDesc(userId).stream()
                .map(ChatThreadDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ChatThreadDto getThreadById(Long threadId) {
        ChatThread thread = threadRepository.findById(threadId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat thread not found with ID: " + threadId));
        return ChatThreadDto.fromEntity(thread);
    }

    @Transactional
    public ChatMessageDto sendMessage(Long threadId, User sender, String senderType, String content) {
        ChatThread thread = threadRepository.findById(threadId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat thread not found with ID: " + threadId));

        if (thread.getStatus() == ChatStatus.CLOSED) {
            throw new BusinessRuleException("Cannot send message in a closed chat thread");
        }

        ChatMessage msg = ChatMessage.builder()
                .thread(thread)
                .senderType(senderType)
                .senderId(sender != null ? sender.getId() : null)
                .senderName(sender != null ? sender.getFullName() : senderType)
                .content(content)
                .isRead(false)
                .build();

        msg = messageRepository.save(msg);

        thread.setLastMessageText(content);
        thread.setLastMessageAt(LocalDateTime.now());
        if ("CUSTOMER".equalsIgnoreCase(senderType)) {
            thread.setUnreadCountAdmin((thread.getUnreadCountAdmin() != null ? thread.getUnreadCountAdmin() : 0) + 1);
        } else {
            thread.setUnreadCountCustomer((thread.getUnreadCountCustomer() != null ? thread.getUnreadCountCustomer() : 0) + 1);
        }
        threadRepository.save(thread);

        return ChatMessageDto.fromEntity(msg);
    }

    @Transactional
    public ChatThreadDto escalateThread(Long threadId, String reason) {
        ChatThread thread = threadRepository.findById(threadId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat thread not found with ID: " + threadId));

        thread.setMode(ChatMode.ADMIN);
        thread.setStatus(ChatStatus.WAITING_FOR_ADMIN);
        thread.setEscalatedAt(LocalDateTime.now());

        ChatMessage sysMsg = ChatMessage.builder()
                .thread(thread)
                .senderType("SYSTEM")
                .senderName("SmartStay Assistant")
                .content("Thread escalated to customer support staff. Reason: " + (reason != null ? reason : "Requested by guest"))
                .isRead(false)
                .build();
        messageRepository.save(sysMsg);

        thread = threadRepository.save(thread);
        return ChatThreadDto.fromEntity(thread);
    }

    @Transactional(readOnly = true)
    public PageData<ChatThreadDto> searchThreads(
            String query, ChatStatus status, Boolean assignedToMe, Boolean unreadOnly, Long adminId, int page, int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "lastMessageAt"));
        Page<ChatThread> tPage = threadRepository.searchThreads(query, status, assignedToMe, unreadOnly, adminId, pageable);

        List<ChatThreadDto> dtos = tPage.getContent().stream()
                .map(ChatThreadDto::fromEntity)
                .collect(Collectors.toList());

        return PageData.of(dtos, tPage.getNumber(), tPage.getSize(), tPage.getTotalElements());
    }

    @Transactional
    public ChatThreadDto assignAdmin(Long threadId, Long adminId, String adminName) {
        ChatThread thread = threadRepository.findById(threadId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat thread not found with ID: " + threadId));

        if (adminId != null) {
            User admin = userRepository.findById(adminId).orElse(null);
            thread.setAssignedAdmin(admin);
        }

        thread.setStatus(ChatStatus.ASSIGNED);
        thread.setMode(ChatMode.ADMIN);
        thread = threadRepository.save(thread);
        return ChatThreadDto.fromEntity(thread);
    }

    @Transactional
    public ChatThreadDto resolveThread(Long threadId) {
        ChatThread thread = threadRepository.findById(threadId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat thread not found with ID: " + threadId));

        thread.setStatus(ChatStatus.RESOLVED);
        thread.setResolvedAt(LocalDateTime.now());
        thread = threadRepository.save(thread);
        return ChatThreadDto.fromEntity(thread);
    }

    @Transactional
    public void markAsRead(Long threadId, boolean isCustomer) {
        ChatThread thread = threadRepository.findById(threadId).orElse(null);
        if (thread != null) {
            if (isCustomer) {
                thread.setUnreadCountCustomer(0);
            } else {
                thread.setUnreadCountAdmin(0);
            }
            threadRepository.save(thread);
        }
    }
}
