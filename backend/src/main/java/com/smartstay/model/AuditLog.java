package com.smartstay.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "actor_user_id")
    private Long actorUserId;

    @Column(name = "action", nullable = false)
    private String action;

    @Column(name = "entity_type")
    private String entityType;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "old_value_json", length = 2000)
    private String oldValueJson;

    @Column(name = "new_value_json", length = 2000)
    private String newValueJson;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public AuditLog() {
    }

    public AuditLog(Long id, Long actorUserId, String action, String entityType, Long entityId, String oldValueJson, String newValueJson, String ipAddress, LocalDateTime createdAt) {
        this.id = id;
        this.actorUserId = actorUserId;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.oldValueJson = oldValueJson;
        this.newValueJson = newValueJson;
        this.ipAddress = ipAddress;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getActorUserId() {
        return actorUserId;
    }

    public void setActorUserId(Long actorUserId) {
        this.actorUserId = actorUserId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public String getOldValueJson() {
        return oldValueJson;
    }

    public void setOldValueJson(String oldValueJson) {
        this.oldValueJson = oldValueJson;
    }

    public String getNewValueJson() {
        return newValueJson;
    }

    public void setNewValueJson(String newValueJson) {
        this.newValueJson = newValueJson;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static AuditLogBuilder builder() {
        return new AuditLogBuilder();
    }

    public static class AuditLogBuilder {
        private Long id;
        private Long actorUserId;
        private String action;
        private String entityType;
        private Long entityId;
        private String oldValueJson;
        private String newValueJson;
        private String ipAddress;
        private LocalDateTime createdAt;

        public AuditLogBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public AuditLogBuilder actorUserId(Long actorUserId) {
            this.actorUserId = actorUserId;
            return this;
        }

        public AuditLogBuilder action(String action) {
            this.action = action;
            return this;
        }

        public AuditLogBuilder entityType(String entityType) {
            this.entityType = entityType;
            return this;
        }

        public AuditLogBuilder entityId(Long entityId) {
            this.entityId = entityId;
            return this;
        }

        public AuditLogBuilder oldValueJson(String oldValueJson) {
            this.oldValueJson = oldValueJson;
            return this;
        }

        public AuditLogBuilder newValueJson(String newValueJson) {
            this.newValueJson = newValueJson;
            return this;
        }

        public AuditLogBuilder ipAddress(String ipAddress) {
            this.ipAddress = ipAddress;
            return this;
        }

        public AuditLogBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public AuditLog build() {
            return new AuditLog(id, actorUserId, action, entityType, entityId, oldValueJson, newValueJson, ipAddress, createdAt);
        }
    }
}
