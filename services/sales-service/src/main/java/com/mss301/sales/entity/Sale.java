package com.mss301.sales.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
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
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "sales")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE sales SET deleted = true, updated_at = now() WHERE id = ?")
@SQLRestriction("deleted = false")
public class Sale {

    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, unique = true, length = 40)
    private String code;

    @Column(name = "sale_time", length = 20)
    private String saleTime;

    @Column(length = 120)
    private String cashier;

    @Column(nullable = false)
    private Integer items;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal total;

    @Column(length = 30)
    private String payment;

    @Column(length = 20, nullable = false)
    @Builder.Default
    private String status = "PENDING";

    // ----- Customer / loyalty -----
    @Column(name = "customer_code", length = 30)
    private String customerCode;

    @Column(name = "customer_name", length = 150)
    private String customerName;

    @Column(precision = 14, scale = 2)
    private BigDecimal subtotal;

    @Column(precision = 14, scale = 2)
    private BigDecimal discount;

    @Column(precision = 14, scale = 2)
    private BigDecimal vat;

    @Column(name = "amount_received", precision = 14, scale = 2)
    private BigDecimal amountReceived;

    @Column(name = "change_given", precision = 14, scale = 2)
    private BigDecimal changeGiven;

    @Column(name = "points_earned")
    private Integer pointsEarned;

    @Column(name = "points_redeemed")
    private Integer pointsRedeemed;

    /** True once stock has been decremented and loyalty applied — prevents double-apply. */
    @Column(name = "effects_applied", nullable = false)
    @Builder.Default
    private boolean effectsApplied = false;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "sale_id")
    @Builder.Default
    private List<SaleItem> lineItems = new ArrayList<>();

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
