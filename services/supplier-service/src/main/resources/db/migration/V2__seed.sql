-- Seed supplier data mirroring the frontend mock (Supermarket_UI/src/mock/db.js).

INSERT INTO suppliers (id, code, name, contact, phone, rating, status, terms) VALUES
    ('44444444-4444-4444-8444-000000000001', N'S001', N'Công ty Vinamilk',  N'Mr. Bình', N'02838100888', 4.8, N'Active',  N'NET 30'),
    ('44444444-4444-4444-8444-000000000002', N'S002', N'Masan Consumer',    N'Ms. Lan',  N'02839100999', 4.5, N'Active',  N'NET 45'),
    ('44444444-4444-4444-8444-000000000003', N'S003', N'Acecook Việt Nam',  N'Mr. Tâm',  N'02837100111', 4.2, N'Active',  N'NET 30'),
    ('44444444-4444-4444-8444-000000000004', N'S004', N'Unilever VN',       N'Ms. Hoa',  N'02835100222', 4.6, N'On hold', N'NET 60');

INSERT INTO purchase_orders (id, code, supplier, order_date, items, total, status, approval) VALUES
    ('44444444-4444-4444-8444-000000000005', N'PO-2026-041', N'Công ty Vinamilk', '2026-06-12',  8, 18600000, N'Pending',  N'Chờ duyệt'),
    ('44444444-4444-4444-8444-000000000006', N'PO-2026-040', N'Acecook Việt Nam', '2026-06-11',  4,  9200000, N'Approved', N'Đã duyệt'),
    ('44444444-4444-4444-8444-000000000007', N'PO-2026-039', N'Masan Consumer',   '2026-06-09', 12, 24500000, N'Received', N'Đã duyệt'),
    ('44444444-4444-4444-8444-000000000008', N'PO-2026-038', N'Unilever VN',      '2026-06-07',  6, 13100000, N'Rejected', N'Từ chối');
