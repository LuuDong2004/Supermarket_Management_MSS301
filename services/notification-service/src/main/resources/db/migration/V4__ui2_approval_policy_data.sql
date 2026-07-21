UPDATE approval_requests SET status = CASE
    WHEN status LIKE '%duy%' OR status LIKE '%Duy%' THEN 'PENDING'
    ELSE 'APPROVED'
END WHERE deleted = 0;

INSERT INTO approval_requests (id, code, type, requester, target, req_date, status, note) VALUES
    (UUID(), 'APR-601', 'ROLE_CHANGE', 'Administrator', 'cashier01 to Warehouse Staff', '2026-07-21', 'PENDING', 'Operational transfer request'),
    (UUID(), 'APR-602', 'VAT_CONFIG', 'Administrator', 'VAT rate for dairy products', '2026-07-21', 'PENDING', 'Effective next accounting period'),
    (UUID(), 'APR-603', 'PROMOTION', 'Administrator', 'Weekend Dairy Sale', '2026-07-20', 'PENDING', 'Ten percent member discount'),
    (UUID(), 'APR-604', 'PERMISSION', 'Administrator', 'Reporting permission for Staff Manager', '2026-07-20', 'REVIEW', 'Quarterly permission review'),
    (UUID(), 'APR-605', 'INVENTORY_POLICY', 'Warehouse Manager', 'Low stock threshold update', '2026-07-19', 'PENDING', 'Threshold based on July demand');

INSERT INTO business_policies (id, code, name, value, category, updated_date) VALUES
    (UUID(), 'BP06', 'Loyalty redemption limit', 'Maximum 50 percent per order', 'Loyalty', '2026-07-18'),
    (UUID(), 'BP07', 'Cold storage receiving', 'Temperature between 2 and 8 C', 'Inventory', '2026-07-17'),
    (UUID(), 'BP08', 'Purchase approval threshold', 'CEO approval above 20000000 VND', 'Purchasing', '2026-07-16');

INSERT INTO notifications (id, title, message, level, recipient, read_flag) VALUES
    (UUID(), 'Approval queue updated', 'Five operational requests require executive review.', 'WARN', 'ceo', 0),
    (UUID(), 'Goods receipt pending', 'GR-260721-01 is waiting for warehouse manager approval.', 'INFO', 'warehouse_manager', 0),
    (UUID(), 'Attendance exception', 'One employee is absent and two arrived late today.', 'WARN', 'staff_manager', 0);
