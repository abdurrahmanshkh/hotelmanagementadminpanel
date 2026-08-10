package com.smartstay.dto.notification;

import com.smartstay.model.NotificationEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {

    private Long id;
    private Long userId;
    private String type;
    private String title;
    private String message;
    private boolean read;
    private String linkUrl;
    private String createdAt;

    public static NotificationDto fromEntity(NotificationEntity n) {
        if (n == null) return null;
        return NotificationDto.builder()
                .id(n.getId())
                .userId(n.getUser() != null ? n.getUser().getId() : null)
                .type(n.getType())
                .title(n.getTitle())
                .message(n.getMessage())
                .read(Boolean.TRUE.equals(n.getRead()))
                .linkUrl(n.getLinkUrl())
                .createdAt(n.getCreatedAt() != null ? n.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .build();
    }
}
