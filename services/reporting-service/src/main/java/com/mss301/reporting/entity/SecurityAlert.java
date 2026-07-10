package com.mss301.reporting.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

/**
 * Security alert backing UC-A05 (suspicious access / permission risks).
 */
@Entity
@Table(name = "security_alerts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE security_alerts SET deleted = true, updated_at = now() WHERE id = ?")
@SQLRestriction("deleted = false")
public class SecurityAlert {

    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, length = 20)
    private String code;

    // e.g. Đăng nhập thất bại | Truy cập trái phép | Rủi ro phân quyền
    @Column(nullable = false, length = 80)
    private String type;

    // Cao | Trung bình | Thấp
    @Column(nullable = false, length = 20)
    private String severity;

    @Column(nullable = false, length = 80)
    private String source;

    @Column(length = 80)
    private String actor;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "detected_at", nullable = false, length = 30)
    private String detectedAt;

    // Mở | Đã xử lý
    @Column(nullable = false, length = 20)
    private String status;

    @Column(length = 512)
    private String note;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(nullable = false)
    private boolean deleted;

    @PrePersist
    void ensureId() {
        if (id == null) {
            id = UUID.randomUUID();
        }
    }
}
