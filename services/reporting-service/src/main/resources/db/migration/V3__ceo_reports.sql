-- CEO reporting datasets: financial reports (UC-CEO02), operational metrics
-- (UC-CEO03) and strategic decisions (UC-CEO07).

CREATE TABLE financial_reports (
    id           VARCHAR(36)  PRIMARY KEY,
    month        VARCHAR(10)  NOT NULL,
    revenue      INTEGER      NOT NULL,
    cost         INTEGER      NOT NULL,
    gross_profit INTEGER      NOT NULL,
    net_profit   INTEGER      NOT NULL,
    seq          INTEGER      NOT NULL,
    created_at   DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at   DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted      TINYINT(1)   NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE operational_metrics (
    id               VARCHAR(36)  PRIMARY KEY,
    area             VARCHAR(80)  NOT NULL,
    orders           INTEGER      NOT NULL,
    inventory_value  INTEGER      NOT NULL,
    turnover_rate    DECIMAL(5,2) NOT NULL,
    low_stock_items  INTEGER      NOT NULL,
    fulfillment_rate DECIMAL(5,2) NOT NULL,
    staff_score      INTEGER      NOT NULL,
    seq              INTEGER      NOT NULL,
    created_at       DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at       DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted          TINYINT(1)   NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE strategic_decisions (
    id            VARCHAR(36)   PRIMARY KEY,
    code          VARCHAR(30)   NOT NULL,
    title         VARCHAR(200)  NOT NULL,
    category      VARCHAR(40)   NOT NULL,
    priority      VARCHAR(20)   NOT NULL,
    status        VARCHAR(30)   NOT NULL,
    decision_date DATE          NOT NULL,
    owner         VARCHAR(120)  NOT NULL,
    description   VARCHAR(1000),
    created_at    DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at    DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted       TINYINT(1)    NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE UNIQUE INDEX uq_strategic_decisions_code ON strategic_decisions (code);

-- Amounts in millions of VND, aligned with monthly_revenue.
INSERT INTO financial_reports (id, month, revenue, cost, gross_profit, net_profit, seq) VALUES
    (UUID(), 'T1',  980, 720, 260, 120, 1),
    (UUID(), 'T2', 1120, 810, 310, 150, 2),
    (UUID(), 'T3', 1040, 770, 270, 128, 3),
    (UUID(), 'T4', 1260, 900, 360, 185, 4),
    (UUID(), 'T5', 1340, 950, 390, 205, 5),
    (UUID(), 'T6',  880, 690, 190,  70, 6);

INSERT INTO operational_metrics (id, area, orders, inventory_value, turnover_rate, low_stock_items, fulfillment_rate, staff_score, seq) VALUES
    (UUID(), 'Đồ uống',        1240, 320, 4.20, 3, 98.50, 92, 1),
    (UUID(), 'Thực phẩm khô',   980, 280, 3.10, 5, 97.20, 88, 2),
    (UUID(), 'Gia vị',          610, 150, 2.40, 2, 99.10, 90, 3),
    (UUID(), 'Hóa phẩm',        540, 190, 2.80, 4, 96.80, 85, 4),
    (UUID(), 'Thực phẩm tươi',  720,  90, 6.50, 6, 95.40, 87, 5);

INSERT INTO strategic_decisions (id, code, title, category, priority, status, decision_date, owner, description) VALUES
    (UUID(), 'SD01', 'Mở rộng ngành hàng đồ uống nhập khẩu', 'Kinh doanh', 'Cao', 'Đang thực thi', '2026-06-05', 'CEO', 'Tăng tỉ trọng nhóm đồ uống lên 35% nhằm cải thiện biên lợi nhuận.'),
    (UUID(), 'SD02', 'Chuẩn hóa chính sách ca làm việc',      'Nhân sự',    'Trung bình', 'Đã ban hành', '2026-06-08', 'CEO', 'Áp dụng khung ca sáng/chiều/tối thống nhất cho toàn hệ thống.'),
    (UUID(), 'SD03', 'Ngân sách khuyến mãi Quý III',          'Khuyến mãi', 'Cao', 'Nháp', '2026-06-12', 'CEO', 'Phê duyệt hạn mức ngân sách khuyến mãi tối đa 500 triệu cho Quý III.');
