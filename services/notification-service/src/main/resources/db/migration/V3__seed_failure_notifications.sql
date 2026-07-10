-- System failure notifications for the admin (UC-A06). Reuses the existing
-- `level` column as severity (INFO | WARN | CRITICAL).
INSERT INTO notifications (id, title, message, level, recipient, read_flag) VALUES
    (UUID(), 'Sự cố: product-service DOWN',   'product-service không phản hồi health-check lúc 21:40.',     'CRITICAL', 'admin', 0),
    (UUID(), 'Sự cố: inventory-service DOWN',  'inventory-service mất kết nối Eureka, đang thử lại.',        'CRITICAL', 'admin', 0),
    (UUID(), 'Cảnh báo: CPU api-gateway cao',  'api-gateway sử dụng CPU 88% trong 5 phút.',                  'WARN',     'admin', 0),
    (UUID(), 'Cảnh báo: Payment gateway chậm', 'SePay phản hồi > 3s cho 12 giao dịch gần nhất.',             'WARN',     'admin', 0),
    (UUID(), 'Khôi phục: sales-service UP',     'sales-service đã hoạt động trở lại sau 4 phút gián đoạn.',   'INFO',     'admin', 0);
