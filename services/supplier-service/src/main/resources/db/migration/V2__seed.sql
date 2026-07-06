-- Seed supplier data mirroring the frontend mock (Supermarket_UI/src/mock/db.js).

INSERT INTO suppliers (id, code, name, contact, phone, rating, status, terms) VALUES
    ('44444444-4444-4444-8444-000000000001', 'S001', 'Công ty Vinamilk',  'Mr. Bình', '02838100888', 4.8, 'Active',  'NET 30'),
    ('44444444-4444-4444-8444-000000000002', 'S002', 'Masan Consumer',    'Ms. Lan',  '02839100999', 4.5, 'Active',  'NET 45'),
    ('44444444-4444-4444-8444-000000000003', 'S003', 'Acecook Việt Nam',  'Mr. Tâm',  '02837100111', 4.2, 'Active',  'NET 30'),
    ('44444444-4444-4444-8444-000000000004', 'S004', 'Unilever VN',       'Ms. Hoa',  '02835100222', 4.6, 'On hold', 'NET 60');

INSERT INTO purchase_orders (id, code, supplier, order_date, items, total, status, approval) VALUES
    ('44444444-4444-4444-8444-000000000005', 'PO-2026-041', 'Công ty Vinamilk', '2026-06-12',  8, 18600000, 'Pending',  'Chờ duyệt'),
    ('44444444-4444-4444-8444-000000000006', 'PO-2026-040', 'Acecook Việt Nam', '2026-06-11',  4,  9200000, 'Approved', 'Đã duyệt'),
    ('44444444-4444-4444-8444-000000000007', 'PO-2026-039', 'Masan Consumer',   '2026-06-09', 12, 24500000, 'Received', 'Đã duyệt'),
    ('44444444-4444-4444-8444-000000000008', 'PO-2026-038', 'Unilever VN',      '2026-06-07',  6, 13100000, 'Rejected', 'Từ chối');
