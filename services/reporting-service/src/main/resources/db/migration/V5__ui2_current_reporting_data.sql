UPDATE sales_trend SET label = 'Mon', revenue = 96, orders = 284 WHERE seq = 1;
UPDATE sales_trend SET label = 'Tue', revenue = 104, orders = 301 WHERE seq = 2;
UPDATE sales_trend SET label = 'Wed', revenue = 112, orders = 326 WHERE seq = 3;
UPDATE sales_trend SET label = 'Thu', revenue = 118, orders = 341 WHERE seq = 4;
UPDATE sales_trend SET label = 'Fri', revenue = 124, orders = 369 WHERE seq = 5;
UPDATE sales_trend SET label = 'Sat', revenue = 146, orders = 428 WHERE seq = 6;
UPDATE sales_trend SET label = 'Sun', revenue = 128, orders = 382 WHERE seq = 7;

UPDATE category_share SET name = 'Dairy Products' WHERE value = 32;
UPDATE category_share SET name = 'Dry Food' WHERE value = 28;
UPDATE category_share SET name = 'Seasoning' WHERE value = 16;
UPDATE category_share SET name = 'Household' WHERE value = 14;
UPDATE category_share SET name = 'Fresh Food' WHERE value = 10;

UPDATE financial_reports SET month = 'Jan', revenue = 980, cost = 720, gross_profit = 260, net_profit = 120 WHERE seq = 1;
UPDATE financial_reports SET month = 'Feb', revenue = 1120, cost = 810, gross_profit = 310, net_profit = 150 WHERE seq = 2;
UPDATE financial_reports SET month = 'Mar', revenue = 1040, cost = 770, gross_profit = 270, net_profit = 128 WHERE seq = 3;
UPDATE financial_reports SET month = 'Apr', revenue = 1260, cost = 900, gross_profit = 360, net_profit = 185 WHERE seq = 4;
UPDATE financial_reports SET month = 'May', revenue = 1340, cost = 950, gross_profit = 390, net_profit = 205 WHERE seq = 5;
UPDATE financial_reports SET month = 'Jun', revenue = 1480, cost = 1010, gross_profit = 470, net_profit = 252 WHERE seq = 6;

INSERT INTO system_logs (id, code, time, level, service, message, actor) VALUES
    (UUID(), 'L9101', '2026-07-21 08:12:03', 'INFO', 'sales-service', 'Completed sale INV-20260721-0111', 'cashier01'),
    (UUID(), 'L9102', '2026-07-21 08:38:17', 'INFO', 'sales-service', 'Completed QR sale INV-20260721-0112', 'cashier01'),
    (UUID(), 'L9103', '2026-07-21 09:02:44', 'WARN', 'inventory-service', 'Reorder threshold reached for P011', 'system'),
    (UUID(), 'L9104', '2026-07-21 09:16:29', 'INFO', 'supplier-service', 'Goods receipt GR-260721-01 submitted', 'warehouse01'),
    (UUID(), 'L9105', '2026-07-21 09:31:55', 'INFO', 'user-service', 'Attendance batch synchronized', 'staffmanager');
