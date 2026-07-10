-- Staff shift scheduling (UC-HR-02).
CREATE TABLE staff_shifts (
    id            VARCHAR(36)   PRIMARY KEY,
    code          VARCHAR(40)   NOT NULL,
    employee_code VARCHAR(50),
    employee_name VARCHAR(150)  NOT NULL,
    shift_date    DATE          NOT NULL,
    shift_type    VARCHAR(20)   NOT NULL,
    start_time    VARCHAR(10),
    end_time      VARCHAR(10),
    area          VARCHAR(100),
    note          VARCHAR(255),
    status        VARCHAR(20)   NOT NULL DEFAULT 'Lên lịch',
    created_at    DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at    DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted       TINYINT(1)    NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE UNIQUE INDEX uq_staff_shifts_code ON staff_shifts (code);
CREATE INDEX idx_staff_shifts_date     ON staff_shifts (shift_date);
CREATE INDEX idx_staff_shifts_employee ON staff_shifts (employee_code);
CREATE INDEX idx_staff_shifts_deleted  ON staff_shifts (deleted);

-- A few sample assignments (dates are illustrative).
INSERT INTO staff_shifts (id, code, employee_code, employee_name, shift_date, shift_type, start_time, end_time, area, status) VALUES
 (UUID(), 'SHF-0001', 'EMP-0001', 'Nguyễn Văn An',  '2026-07-11', 'Sáng',  '06:00', '14:00', 'Quầy thu ngân', 'Lên lịch'),
 (UUID(), 'SHF-0002', 'EMP-0002', 'Trần Thị Bình',  '2026-07-11', 'Chiều', '14:00', '22:00', 'Kho hàng',      'Lên lịch'),
 (UUID(), 'SHF-0003', 'EMP-0003', 'Lê Văn Cường',   '2026-07-12', 'Đêm',   '22:00', '06:00', 'Bảo vệ',        'Lên lịch');
