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

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Operational performance per business area backing UC-CEO03
 * (operational report: inventory performance and staff performance).
 */
@Entity
@Table(name = "operational_metrics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE operational_metrics SET deleted = true, updated_at = now() WHERE id = ?")
@SQLRestriction("deleted = false")
public class OperationalMetric {

    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, length = 80)
    private String area;

    @Column(nullable = false)
    private Integer orders;

    // Inventory value on hand, millions of VND.
    @Column(name = "inventory_value", nullable = false)
    private Integer inventoryValue;

    // Stock turnover ratio for the period.
    @Column(name = "turnover_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal turnoverRate;

    @Column(name = "low_stock_items", nullable = false)
    private Integer lowStockItems;

    // Order fulfillment rate, percent.
    @Column(name = "fulfillment_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal fulfillmentRate;

    // Aggregated staff productivity score for the area.
    @Column(name = "staff_score", nullable = false)
    private Integer staffScore;

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
