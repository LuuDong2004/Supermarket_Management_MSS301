package com.mss301.sales.entity;

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

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "shifts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE shifts SET deleted = true, updated_at = now() WHERE id = ?")
@SQLRestriction("deleted = false")
public class Shift {

    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, unique = true, length = 30)
    private String code;

    @Column(length = 120)
    private String cashier;

    @Column(name = "open_at", length = 30)
    private String openAt;

    @Column(name = "close_at", length = 30)
    private String closeAt;

    @Column(precision = 14, scale = 2)
    private BigDecimal opening;

    @Column(precision = 14, scale = 2)
    private BigDecimal sales;

    /** Cash the cashier declares in the drawer at close. */
    @Column(name = "closing_actual", precision = 14, scale = 2)
    private BigDecimal closingActual;

    /** System-calculated cash = opening + sales. */
    @Column(name = "closing_expected", precision = 14, scale = 2)
    private BigDecimal closingExpected;

    /** Overage (positive) / shortage (negative) = actual - expected. */
    @Column(precision = 14, scale = 2)
    private BigDecimal variance;

    @Column(name = "variance_note", length = 255)
    private String varianceNote;

    /** Number of orders processed during the shift. */
    private Integer orders;

    @Column(length = 20)
    private String status;

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
