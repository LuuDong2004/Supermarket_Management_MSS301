-- Seed supplier data mirroring the frontend mock (Supermarket_UI/src/mock/db.js).

INSERT INTO suppliers (id, code, name, contact, phone, rating, status, terms) VALUES
    (gen_random_uuid(), 'S001', 'Công ty Vinamilk',  'Mr. Bình', '02838100888', 4.8, 'Active',  'NET 30'),
    (gen_random_uuid(), 'S002', 'Masan Consumer',    'Ms. Lan',  '02839100999', 4.5, 'Active',  'NET 45'),
    (gen_random_uuid(), 'S003', 'Acecook Việt Nam',  'Mr. Tâm',  '02837100111', 4.2, 'Active',  'NET 30'),
    (gen_random_uuid(), 'S004', 'Unilever VN',       'Ms. Hoa',  '02835100222', 4.6, 'On hold', 'NET 60');

INSERT INTO purchase_orders (id, code, supplier, order_date, items, total, status, approval) VALUES
    (gen_random_uuid(), 'PO-2026-041', 'Công ty Vinamilk', '2026-06-12',  8, 18600000, 'Pending',  'Chờ duyệt'),
    (gen_random_uuid(), 'PO-2026-040', 'Acecook Việt Nam', '2026-06-11',  4,  9200000, 'Approved', 'Đã duyệt'),
    (gen_random_uuid(), 'PO-2026-039', 'Masan Consumer',   '2026-06-09', 12, 24500000, 'Received', 'Đã duyệt'),
    (gen_random_uuid(), 'PO-2026-038', 'Unilever VN',      '2026-06-07',  6, 13100000, 'Rejected', 'Từ chối');
