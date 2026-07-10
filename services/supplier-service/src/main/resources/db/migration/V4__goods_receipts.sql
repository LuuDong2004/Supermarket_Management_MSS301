-- Goods receipt notes (UC-W01/W06/M05).
CREATE TABLE goods_receipts (
    id           VARCHAR(36)   PRIMARY KEY,
    code         VARCHAR(30)   NOT NULL,
    po_code      VARCHAR(30),
    supplier     VARCHAR(150)  NOT NULL,
    receive_date DATE          NOT NULL,
    received_by  VARCHAR(120),
    items        INTEGER       NOT NULL,
    total        DECIMAL(14,2) NOT NULL,
    status       VARCHAR(30)   NOT NULL,
    note         VARCHAR(500),
    created_at   DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at   DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted      TINYINT(1)    NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE UNIQUE INDEX uq_goods_receipts_code ON goods_receipts (code);

INSERT INTO goods_receipts (id, code, po_code, supplier, receive_date, received_by, items, total, status, note) VALUES
    (UUID(), 'GRN-2601', 'PO-2601', 'Công ty TNHH Tân Hiệp Phát', '2026-07-08', 'Nguyễn Văn Kho', 12, 15600000.00, 'Đã duyệt',  'Nhận đủ, không hư hỏng.'),
    (UUID(), 'GRN-2602', 'PO-2603', 'Công ty CP Acecook Việt Nam', '2026-07-09', 'Trần Thị Kho',  8,  9200000.00, 'Chờ duyệt', 'Thiếu 2 thùng so với đơn, chờ đối chiếu.'),
    (UUID(), 'GRN-2603', NULL,      'Nhà cung cấp Gia vị Miền Nam', '2026-07-10', 'Nguyễn Văn Kho', 5,  3400000.00, 'Chờ duyệt', 'Hàng nhập bổ sung ngoài kế hoạch.');
