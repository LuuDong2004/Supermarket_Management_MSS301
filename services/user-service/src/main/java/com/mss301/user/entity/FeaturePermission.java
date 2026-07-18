package com.mss301.user.entity;

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
 * Role-based permission matrix (UC-A02). One row per feature; a boolean column
 * per role controls whether that role may access the feature. Enforcement of the
 * actual endpoints stays in @PreAuthorize; this table is the admin-configurable view.
 */
@Entity
@Table(name = "feature_permissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE feature_permissions SET deleted = true, updated_at = now() WHERE id = ?")
@SQLRestriction("deleted = false")
public class FeaturePermission {

    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "feature_code", nullable = false, unique = true, length = 20)
    private String featureCode;

    @Column(name = "feature_name", nullable = false, length = 120)
    private String featureName;

    @Column(nullable = false, length = 40)
    private String category;

    @Column(nullable = false)
    private boolean ceo;

    @Column(nullable = false)
    private boolean admin;

    @Column(name = "warehouse_manager", nullable = false)
    private boolean warehouseManager;

    @Column(name = "warehouse_staff", nullable = false)
    private boolean warehouseStaff;

    @Column(name = "staff_manager", nullable = false)
    private boolean staffManager;

    @Column(nullable = false)
    private boolean cashier;

    @Column(nullable = false)
    private Integer seq;

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
