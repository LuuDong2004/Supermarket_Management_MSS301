package com.mss301.product.entity;

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
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "vouchers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE vouchers SET deleted = true, updated_at = now() WHERE id = ?")
@SQLRestriction("deleted = false")
public class Voucher {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, unique = true, length = 40)
    private String code;

    // percent | amount
    @Column(nullable = false, length = 20)
    private String type;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal value;

    @Column(name = "min_spend", nullable = false, precision = 14, scale = 2)
    private BigDecimal minSpend;

    @Column(nullable = false, length = 150)
    private String label;

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
