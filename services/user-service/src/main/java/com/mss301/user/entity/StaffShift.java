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
import java.time.LocalDate;
import java.util.UUID;

/**
 * A staff work-shift assignment (UC-HR-02). One employee has at most one shift
 * per date. Shift types: Sáng (06:00-14:00), Chiều (14:00-22:00), Đêm (22:00-06:00).
 */
@Entity
@Table(name = "staff_shifts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE staff_shifts SET deleted = true, updated_at = now() WHERE id = ?")
@SQLRestriction("deleted = false")
public class StaffShift {

    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, unique = true, length = 40)
    private String code;

    @Column(name = "employee_code", length = 50)
    private String employeeCode;

    @Column(name = "employee_name", nullable = false, length = 150)
    private String employeeName;

    @Column(name = "shift_date", nullable = false)
    private LocalDate shiftDate;

    /** Sáng / Chiều / Đêm */
    @Column(name = "shift_type", nullable = false, length = 20)
    private String shiftType;

    @Column(name = "start_time", length = 10)
    private String startTime;

    @Column(name = "end_time", length = 10)
    private String endTime;

    @Column(length = 100)
    private String area;

    @Column(length = 255)
    private String note;

    @Column(length = 20, nullable = false)
    @Builder.Default
    private String status = "Lên lịch";

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
