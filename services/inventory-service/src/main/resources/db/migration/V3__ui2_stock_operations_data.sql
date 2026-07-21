-- Persist stock-count detail and approval audit fields required by UI2.
ALTER TABLE stock_counts
    ADD COLUMN product_code VARCHAR(30) NULL AFTER note,
    ADD COLUMN product_name VARCHAR(200) NULL AFTER product_code,
    ADD COLUMN system_qty INTEGER NULL AFTER product_name,
    ADD COLUMN physical_qty INTEGER NULL AFTER system_qty,
    ADD COLUMN difference INTEGER NULL AFTER physical_qty,
    ADD COLUMN reason VARCHAR(200) NULL AFTER difference,
    ADD COLUMN category VARCHAR(80) NULL AFTER reason;

ALTER TABLE stock_adjustments
    ADD COLUMN evidence_name VARCHAR(255) NULL AFTER status,
    ADD COLUMN decision_comment VARCHAR(500) NULL AFTER evidence_name;

UPDATE stock_adjustments SET status = CASE
    WHEN status IN ('Chờ duyệt', 'Pending') THEN 'PENDING'
    WHEN status IN ('Đã duyệt', 'Approved') THEN 'APPROVED'
    WHEN status IN ('Từ chối', 'Rejected') THEN 'REJECTED'
    ELSE UPPER(status)
END;
UPDATE warehouse_transactions SET status = CASE
    WHEN status IN ('Chờ duyệt', 'Pending') THEN 'PENDING'
    WHEN status IN ('Đã duyệt', 'Approved') THEN 'APPROVED'
    WHEN status IN ('Từ chối', 'Rejected') THEN 'REJECTED'
    ELSE UPPER(status)
END;
UPDATE stock_counts SET status = CASE
    WHEN status IN ('Hoàn tất', 'Completed') THEN 'COMPLETED'
    WHEN status IN ('Đang kiểm', 'Pending') THEN 'PENDING'
    ELSE UPPER(status)
END;

INSERT INTO stock_counts
    (id, code, location, status, count_date, note, product_code, product_name, system_qty, physical_qty, difference, reason, category)
VALUES
 (UUID(), 'SC-202607-001', 'Kệ A', 'COMPLETED', '2026-07-12', 'Routine cycle count', 'P001', 'Sữa tươi Vinamilk 1L', 120, 120, 0, NULL, 'Đồ uống'),
 (UUID(), 'SC-202607-002', 'Kệ A', 'PENDING_ADJUSTMENT', '2026-07-13', 'Physical count mismatch', 'P003', 'Dầu ăn Neptune 1L', 9, 7, -2, 'Hai chai hư hỏng', 'Gia vị'),
 (UUID(), 'SC-202607-003', 'Kho lạnh', 'COMPLETED', '2026-07-14', 'Cold storage count', 'P006', 'Trứng gà hộp 10', 45, 45, 0, NULL, 'Thực phẩm tươi'),
 (UUID(), 'SC-202607-004', 'Kệ B', 'PENDING_ADJUSTMENT', '2026-07-15', 'Physical count mismatch', 'P008', 'Nước mắm Nam Ngư 500ml', 7, 6, -1, 'Vỡ chai trong kho', 'Gia vị');

INSERT INTO stock_adjustments
    (id, code, product, system_qty, counted_qty, diff, reason, adj_date, status, evidence_name, decision_comment)
VALUES
 (UUID(), 'ADJ-202607-01', 'Dầu ăn Neptune 1L', 9, 7, -2, 'Hư hỏng', '2026-07-13', 'PENDING', 'damage-p003.jpg', NULL),
 (UUID(), 'ADJ-202607-02', 'Nước mắm Nam Ngư 500ml', 7, 6, -1, 'Vỡ chai', '2026-07-15', 'APPROVED', 'broken-bottle.jpg', 'Approved after evidence review'),
 (UUID(), 'ADJ-202607-03', 'Nước ngọt Coca 1.5L', 8, 10, 2, 'Nhập kho thiếu giao dịch', '2026-07-16', 'PENDING', 'receipt-gr-004.pdf', NULL);
