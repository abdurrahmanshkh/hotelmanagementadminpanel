package com.smartstay.controller;

import com.smartstay.dto.chat.ChatMessageDto;
import com.smartstay.dto.chat.ChatThreadDto;
import com.smartstay.dto.common.ApiResponse;
import com.smartstay.dto.common.PageData;
import com.smartstay.enums.ChatMode;
import com.smartstay.enums.ChatStatus;
import com.smartstay.model.User;
import com.smartstay.service.AuthService;
import com.smartstay.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final AuthService authService;

    @PostMapping("/customer/chat/threads")
    public ResponseEntity<ApiResponse<ChatThreadDto>> createThread(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> body
    ) {
        User user = authService.getAuthenticatedUser(userDetails.getUsername());
        Long bookingId = body.get("bookingId") != null ? Long.parseLong(body.get("bookingId").toString()) : null;
        String initialMsg = body.get("initialMessage") != null ? body.get("initialMessage").toString() : null;
        String modeStr = body.get("mode") != null ? body.get("mode").toString() : "BOT";
        ChatMode mode = ChatMode.valueOf(modeStr.toUpperCase());

        ChatThreadDto created = chatService.createThread(user, bookingId, initialMsg, mode);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Chat thread created", created));
    }

    @GetMapping("/customer/chat/threads")
    public ResponseEntity<ApiResponse<List<ChatThreadDto>>> getMyThreads(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getAuthenticatedUser(userDetails.getUsername());
        List<ChatThreadDto> threads = chatService.getCustomerThreads(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Chat threads retrieved", threads));
    }

    @GetMapping("/customer/chat/threads/{id}")
    public ResponseEntity<ApiResponse<ChatThreadDto>> getThreadDetails(@PathVariable Long id) {
        ChatThreadDto thread = chatService.getThreadById(id);
        chatService.markAsRead(id, true);
        return ResponseEntity.ok(ApiResponse.ok("Chat thread retrieved", thread));
    }

    @PostMapping("/customer/chat/threads/{id}/messages")
    public ResponseEntity<ApiResponse<ChatMessageDto>> sendCustomerMessage(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        User user = authService.getAuthenticatedUser(userDetails.getUsername());
        String content = body.get("content") != null ? body.get("content") : body.get("messageText");
        ChatMessageDto msg = chatService.sendMessage(id, user, "CUSTOMER", content);
        return ResponseEntity.ok(ApiResponse.ok("Message sent", msg));
    }

    @PostMapping("/customer/chat/threads/{id}/escalate")
    public ResponseEntity<ApiResponse<ChatThreadDto>> escalateThread(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body
    ) {
        String reason = body != null ? body.get("reason") : "Escalated by guest";
        ChatThreadDto escalated = chatService.escalateThread(id, reason);
        return ResponseEntity.ok(ApiResponse.ok("Thread escalated to support staff", escalated));
    }

    @GetMapping("/admin/chats")
    public ResponseEntity<ApiResponse<PageData<ChatThreadDto>>> searchThreads(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) ChatStatus status,
            @RequestParam(required = false) Boolean assignedToMe,
            @RequestParam(required = false) Boolean unreadOnly,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        User admin = authService.getAuthenticatedUser(userDetails.getUsername());
        PageData<ChatThreadDto> pageData = chatService.searchThreads(query, status, assignedToMe, unreadOnly, admin.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.ok("Chat threads retrieved", pageData));
    }

    @GetMapping("/admin/chats/{id}")
    public ResponseEntity<ApiResponse<ChatThreadDto>> getAdminThreadDetails(@PathVariable Long id) {
        ChatThreadDto thread = chatService.getThreadById(id);
        chatService.markAsRead(id, false);
        return ResponseEntity.ok(ApiResponse.ok("Chat thread details retrieved", thread));
    }

    @PatchMapping("/admin/chats/{id}/assign")
    public ResponseEntity<ApiResponse<ChatThreadDto>> assignAdmin(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User admin = authService.getAuthenticatedUser(userDetails.getUsername());
        ChatThreadDto updated = chatService.assignAdmin(id, admin.getId(), admin.getFullName());
        return ResponseEntity.ok(ApiResponse.ok("Chat assigned to admin", updated));
    }

    @PostMapping("/admin/chats/{id}/messages")
    public ResponseEntity<ApiResponse<ChatMessageDto>> sendAdminMessage(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        User admin = authService.getAuthenticatedUser(userDetails.getUsername());
        String content = body.get("content") != null ? body.get("content") : body.get("messageText");
        ChatMessageDto msg = chatService.sendMessage(id, admin, "ADMIN", content);
        return ResponseEntity.ok(ApiResponse.ok("Admin message sent", msg));
    }

    @PatchMapping("/admin/chats/{id}/resolve")
    public ResponseEntity<ApiResponse<ChatThreadDto>> resolveThread(@PathVariable Long id) {
        ChatThreadDto updated = chatService.resolveThread(id);
        return ResponseEntity.ok(ApiResponse.ok("Chat thread resolved", updated));
    }
}
