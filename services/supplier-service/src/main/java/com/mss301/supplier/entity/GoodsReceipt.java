package com.mss301.supplier.entity;

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
import java.time.LocalDate;
import java.util.UUID;

/**
 * Goods receipt note (UC-W01/W06/M05): recorded by warehouse staff when a shipment
 * arrives, reviewed/approved by the warehouse manager.
 */
@Entity
@Table(name = "goods_receipts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE goods_receipts SET deleted = true, updated_at = now() WHERE id = ?")
@SQLRestriction("deleted = false")
public class GoodsReceipt {

    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, unique = true, length = 30)
    private String code;

    // Logical reference to the originating purchase order (optional).
    @Column(name = "po_code", length = 30)
    private String poCode;

    @Column(nullable = false, length = 150)
    private String supplier;

    @Column(name = "receive_date", nullable = false)
    private LocalDate receiveDate;

    @Column(name = "received_by", length = 120)
    private String receivedBy;

    @Column(nullable = false)
    private Integer items;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal total;

    // Chờ duyệt | Đã duyệt | Từ chối
    @Column(nullable = false, length = 30)
    private String status;

    @Column(length = 500)
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
