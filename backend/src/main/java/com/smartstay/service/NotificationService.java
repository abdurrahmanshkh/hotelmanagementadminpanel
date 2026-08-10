package com.smartstay.service;

import com.smartstay.dto.notification.NotificationDto;
import com.smartstay.exception.ResourceNotFoundException;
import com.smartstay.model.NotificationEntity;
import com.smartstay.model.User;
import com.smartstay.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public NotificationDto createNotification(User user, String type, String title, String message) {
        NotificationEntity entity = NotificationEntity.builder()
                .user(user)
                .type(type)
                .title(title)
                .message(message)
                .read(false)
                .build();
        entity = notificationRepository.save(entity);
        return NotificationDto.fromEntity(entity);
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(NotificationDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public NotificationDto markAsRead(Long notificationId, Long userId) {
        NotificationEntity notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + notificationId));

        notification.setRead(true);
        notification = notificationRepository.save(notification);
        return NotificationDto.fromEntity(notification);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<NotificationEntity> unread = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}
