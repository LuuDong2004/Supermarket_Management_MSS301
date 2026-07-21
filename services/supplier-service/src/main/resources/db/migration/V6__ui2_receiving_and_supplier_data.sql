-- Persist fields shown by Supplier Management and Receive Goods screens.
ALTER TABLE goods_receipts
    ADD COLUMN product_code VARCHAR(30) NULL AFTER total,
    ADD COLUMN product_name VARCHAR(200) NULL AFTER product_code,
    ADD COLUMN quantity INTEGER NULL AFTER product_name,
    ADD COLUMN product_condition VARCHAR(30) NULL AFTER quantity,
    ADD COLUMN expiry DATE NULL AFTER product_condition;

UPDATE goods_receipts SET status = CASE
    WHEN status IN ('Chờ duyệt', 'Pending') THEN 'PENDING'
    WHEN status IN ('Đã duyệt', 'Approved') THEN 'APPROVED'
    WHEN status IN ('Từ chối', 'Rejected') THEN 'REJECTED'
    ELSE UPPER(status)
END;

UPDATE suppliers SET email = CONCAT(LOWER(REPLACE(code, ' ', '')), '@supplier.vn') WHERE email IS NULL;
UPDATE suppliers SET address = 'Khu công nghiệp phân phối TP.HCM' WHERE address IS NULL;

INSERT INTO goods_receipts
    (id, code, po_code, supplier, receive_date, received_by, items, total, status, note, product_code, product_name, quantity, product_condition, expiry)
VALUES
 (UUID(), 'GR-202607-001', 'PO-2026-040', 'Acecook Việt Nam', '2026-07-12', 'Warehouse Staff', 50, 4900000, 'APPROVED', 'Delivery matched purchase order', 'P004', 'Mì Hảo Hảo (thùng 30)', 50, 'GOOD', '2026-12-20'),
 (UUID(), 'GR-202607-002', 'PO-2026-041', 'Công ty Vinamilk', '2026-07-13', 'Warehouse Staff', 36, 936000, 'PENDING', 'Temperature checked at receiving', 'P001', 'Sữa tươi Vinamilk 1L', 36, 'GOOD', '2026-09-12'),
 (UUID(), 'GR-202607-003', 'PO-2026-039', 'Masan Consumer', '2026-07-14', 'Warehouse Staff', 24, 528000, 'APPROVED', 'Two cartons visually inspected', 'P008', 'Nước mắm Nam Ngư 500ml', 24, 'GOOD', '2027-05-15'),
 (UUID(), 'GR-202607-004', 'PO-2026-046', 'Công ty Vinamilk', '2026-07-15', 'Warehouse Staff', 18, 396000, 'PENDING', 'One package requires manager review', 'P011', 'Sữa chua Vinamilk lốc 4', 18, 'INSPECTION', '2026-08-18');
