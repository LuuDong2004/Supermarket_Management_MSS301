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
import java.time.LocalDate;
import java.util.UUID;

/**
 * A strategic business directive submitted by the CEO (UC-CEO07).
 */
@Entity
@Table(name = "strategic_decisions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE strategic_decisions SET deleted = true, updated_at = now() WHERE id = ?")
@SQLRestriction("deleted = false")
public class StrategicDecision {

    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, unique = true, length = 30)
    private String code;

    @Column(nullable = false, length = 200)
    private String title;

    // Business area: Kinh doanh | Nhân sự | Khuyến mãi | Tài chính | Vận hành
    @Column(nullable = false, length = 40)
    private String category;

    // Cao | Trung bình | Thấp
    @Column(nullable = false, length = 20)
    private String priority;

    // Nháp | Đã ban hành | Đang thực thi | Hoàn thành
    @Column(nullable = false, length = 30)
    private String status;

    @Column(name = "decision_date", nullable = false)
    private LocalDate decisionDate;

    @Column(nullable = false, length = 120)
    private String owner;

    @Column(length = 1000)
    private String description;

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
