// In-memory seed data backing the not-yet-implemented services
// (product, inventory, sales, supplier, reporting, HR). This lets the whole
// frontend be demoed end-to-end before those microservices exist.

export const products = [
  { id: 'P001', barcode: '8930001', name: 'Sữa tươi Vinamilk 1L', category: 'Đồ uống', price: 32000, cost: 26000, stock: 120, unit: 'hộp', expiry: '2026-09-12' },
  { id: 'P002', barcode: '8930002', name: 'Gạo ST25 5kg', category: 'Thực phẩm khô', price: 165000, cost: 140000, stock: 64, unit: 'túi', expiry: '2027-01-20' },
  { id: 'P003', barcode: '8930003', name: 'Dầu ăn Neptune 1L', category: 'Gia vị', price: 48000, cost: 41000, stock: 9, unit: 'chai', expiry: '2026-11-05' },
  { id: 'P004', barcode: '8930004', name: 'Mì Hảo Hảo (thùng 30)', category: 'Thực phẩm khô', price: 115000, cost: 98000, stock: 210, unit: 'thùng', expiry: '2026-07-01' },
  { id: 'P005', barcode: '8930005', name: 'Nước ngọt Coca 1.5L', category: 'Đồ uống', price: 18000, cost: 14000, stock: 8, unit: 'chai', expiry: '2026-06-28' },
  { id: 'P006', barcode: '8930006', name: 'Trứng gà hộp 10', category: 'Thực phẩm tươi', price: 35000, cost: 28000, stock: 45, unit: 'hộp', expiry: '2026-06-22' },
  { id: 'P007', barcode: '8930007', name: 'Bột giặt Omo 3kg', category: 'Hóa phẩm', price: 92000, cost: 78000, stock: 38, unit: 'túi', expiry: '2028-03-01' },
  { id: 'P008', barcode: '8930008', name: 'Nước mắm Nam Ngư 500ml', category: 'Gia vị', price: 28000, cost: 22000, stock: 7, unit: 'chai', expiry: '2027-05-15' },
  { id: 'P009', barcode: '8930009', name: 'Cà phê G7 hộp 21', category: 'Đồ uống', price: 56000, cost: 47000, stock: 90, unit: 'hộp', expiry: '2026-12-10' },
  { id: 'P010', barcode: '8930010', name: 'Khăn giấy Pulppy', category: 'Hóa phẩm', price: 24000, cost: 19000, stock: 150, unit: 'lốc', expiry: '2029-01-01' },
]

export const customers = [
  { id: 'C001', name: 'Trần Thị Mai', phone: '0901234567', tier: 'Gold', points: 1240, joined: '2024-03-11', spent: 12400000 },
  { id: 'C002', name: 'Nguyễn Văn Hùng', phone: '0912345678', tier: 'Silver', points: 430, joined: '2025-01-20', spent: 4300000 },
  { id: 'C003', name: 'Lê Hoàng Anh', phone: '0987654321', tier: 'Member', points: 85, joined: '2026-02-02', spent: 850000 },
  { id: 'C004', name: 'Phạm Thu Hà', phone: '0934567890', tier: 'Platinum', points: 5210, joined: '2023-08-15', spent: 52100000 },
]

export const vouchers = [
  { code: 'WELCOME10', type: 'percent', value: 10, min: 100000, label: 'Giảm 10% đơn từ 100k' },
  { code: 'SALE50K', type: 'amount', value: 50000, min: 500000, label: 'Giảm 50k đơn từ 500k' },
  { code: 'FREESHIP', type: 'amount', value: 20000, min: 200000, label: 'Giảm 20k phí giao' },
]

export const promotions = [
  { id: 'PR01', name: 'Tuần lễ đồ uống', scope: 'Đồ uống', discount: 15, type: 'percent', from: '2026-06-10', to: '2026-06-20', status: 'Đang chạy' },
  { id: 'PR02', name: 'Mua 2 tặng 1 mì gói', scope: 'Mì Hảo Hảo', discount: 33, type: 'percent', from: '2026-06-01', to: '2026-06-30', status: 'Đang chạy' },
  { id: 'PR03', name: 'Cuối tuần vàng', scope: 'Toàn bộ', discount: 5, type: 'percent', from: '2026-06-21', to: '2026-06-22', status: 'Lên lịch' },
]

export const suppliers = [
  { id: 'S001', name: 'Công ty Vinamilk', contact: 'Mr. Bình', phone: '02838100888', rating: 4.8, status: 'Active', terms: 'NET 30' },
  { id: 'S002', name: 'Masan Consumer', contact: 'Ms. Lan', phone: '02839100999', rating: 4.5, status: 'Active', terms: 'NET 45' },
  { id: 'S003', name: 'Acecook Việt Nam', contact: 'Mr. Tâm', phone: '02837100111', rating: 4.2, status: 'Active', terms: 'NET 30' },
  { id: 'S004', name: 'Unilever VN', contact: 'Ms. Hoa', phone: '02835100222', rating: 4.6, status: 'On hold', terms: 'NET 60' },
]

export const purchaseOrders = [
  { id: 'PO-2026-041', supplier: 'Công ty Vinamilk', date: '2026-06-12', items: 8, total: 18600000, status: 'Pending', approval: 'Chờ duyệt' },
  { id: 'PO-2026-040', supplier: 'Acecook Việt Nam', date: '2026-06-11', items: 4, total: 9200000, status: 'Approved', approval: 'Đã duyệt' },
  { id: 'PO-2026-039', supplier: 'Masan Consumer', date: '2026-06-09', items: 12, total: 24500000, status: 'Received', approval: 'Đã duyệt' },
  { id: 'PO-2026-038', supplier: 'Unilever VN', date: '2026-06-07', items: 6, total: 13100000, status: 'Rejected', approval: 'Từ chối' },
]

export const warehouseTxns = [
  { id: 'WT-1042', type: 'Nhập kho', ref: 'PO-2026-040', product: 'Mì Hảo Hảo', qty: 50, date: '2026-06-13', status: 'Chờ duyệt' },
  { id: 'WT-1041', type: 'Xuất kho', ref: 'SO-9921', product: 'Sữa Vinamilk', qty: -30, date: '2026-06-13', status: 'Chờ duyệt' },
  { id: 'WT-1040', type: 'Điều chỉnh', ref: 'ADJ-220', product: 'Trứng gà', qty: -5, date: '2026-06-12', status: 'Đã duyệt' },
  { id: 'WT-1039', type: 'Nhập kho', ref: 'PO-2026-039', product: 'Nước mắm Nam Ngư', qty: 100, date: '2026-06-11', status: 'Đã duyệt' },
]

export const stockAdjustments = [
  { id: 'ADJ-221', product: 'Dầu ăn Neptune', system: 12, counted: 9, diff: -3, reason: 'Hư hỏng', date: '2026-06-13', status: 'Chờ duyệt' },
  { id: 'ADJ-220', product: 'Trứng gà hộp 10', system: 50, counted: 45, diff: -5, reason: 'Vỡ', date: '2026-06-12', status: 'Đã duyệt' },
  { id: 'ADJ-219', product: 'Coca 1.5L', system: 10, counted: 8, diff: -2, reason: 'Thất thoát', date: '2026-06-10', status: 'Từ chối' },
]

export const employees = [
  { id: 'E001', name: 'Nguyễn Văn A', role: 'ROLE_CASHIER', dept: 'Thu ngân', joined: '2024-05-01', phone: '0901111222', status: 'Đang làm', salary: 8500000 },
  { id: 'E002', name: 'Trần Thị B', role: 'ROLE_WAREHOUSE', dept: 'Kho', joined: '2023-11-15', phone: '0902222333', status: 'Đang làm', salary: 9200000 },
  { id: 'E003', name: 'Lê Văn C', role: 'ROLE_CASHIER', dept: 'Thu ngân', joined: '2025-02-10', phone: '0903333444', status: 'Đang làm', salary: 8000000 },
  { id: 'E004', name: 'Phạm Thị D', role: 'ROLE_ADMIN', dept: 'Quản trị', joined: '2022-07-20', phone: '0904444555', status: 'Đang làm', salary: 14000000 },
]

export const attendance = [
  { id: 'AT1', employee: 'Nguyễn Văn A', date: '2026-06-15', in: '07:55', out: '16:05', hours: 8, status: 'Đúng giờ' },
  { id: 'AT2', employee: 'Trần Thị B', date: '2026-06-15', in: '08:10', out: '17:00', hours: 8, status: 'Đi muộn' },
  { id: 'AT3', employee: 'Lê Văn C', date: '2026-06-15', in: '—', out: '—', hours: 0, status: 'Vắng' },
  { id: 'AT4', employee: 'Phạm Thị D', date: '2026-06-15', in: '07:50', out: '17:10', hours: 9, status: 'Đúng giờ' },
]

export const approvalRequests = [
  { id: 'AR-501', type: 'Tạo tài khoản', requester: 'Phạm Thị D (Admin)', target: 'User: cashier_le', date: '2026-06-14', status: 'Chờ duyệt', note: 'Thêm thu ngân ca tối' },
  { id: 'AR-500', type: 'Thay đổi quyền', requester: 'Phạm Thị D (Admin)', target: 'User: tranb → Warehouse Mgr', date: '2026-06-13', status: 'Chờ duyệt', note: 'Đề xuất thăng chức' },
  { id: 'AR-499', type: 'Điều chỉnh kho', requester: 'Trần Thị B (Warehouse)', target: 'ADJ-221', date: '2026-06-13', status: 'Chờ duyệt', note: 'Dầu ăn hư hỏng 3 chai' },
  { id: 'AR-498', type: 'Chính sách giá', requester: 'CEO Office', target: 'PR03 Cuối tuần vàng', date: '2026-06-12', status: 'Đã duyệt', note: '' },
]

export const businessPolicies = [
  { id: 'BP01', name: 'Hạn mức giảm giá thu ngân', value: '≤ 10%', category: 'Bán hàng', updated: '2026-05-30' },
  { id: 'BP02', name: 'Ngưỡng cảnh báo tồn kho thấp', value: '10 đơn vị', category: 'Kho', updated: '2026-06-01' },
  { id: 'BP03', name: 'Cảnh báo cận hạn sử dụng', value: '30 ngày', category: 'Kho', updated: '2026-06-01' },
  { id: 'BP04', name: 'Tỷ lệ tích điểm thành viên', value: '1đ / 10.000đ', category: 'Thành viên', updated: '2026-04-15' },
  { id: 'BP05', name: 'Hạn mức duyệt PO của Quản lý kho', value: '≤ 20.000.000đ', category: 'Mua hàng', updated: '2026-05-20' },
]

export const systemLogs = [
  { id: 'L9001', time: '2026-06-15 09:42:11', level: 'INFO', service: 'auth-service', message: 'User ceo logged in', user: 'ceo' },
  { id: 'L9000', time: '2026-06-15 09:40:03', level: 'WARN', service: 'inventory-service', message: 'Low stock: Dầu ăn Neptune (9)', user: 'system' },
  { id: 'L8999', time: '2026-06-15 09:31:55', level: 'ERROR', service: 'sales-service', message: 'Payment gateway timeout, retried OK', user: 'cashier01' },
  { id: 'L8998', time: '2026-06-15 09:15:22', level: 'INFO', service: 'user-service', message: 'Account created: cashier_le', user: 'admin' },
  { id: 'L8997', time: '2026-06-15 08:58:40', level: 'INFO', service: 'api-gateway', message: 'Health check OK (8 services up)', user: 'system' },
]

export const services = [
  { name: 'api-gateway', port: 8080, status: 'UP', uptime: '12d 4h', cpu: 14, mem: 38 },
  { name: 'auth-service', port: 8081, status: 'UP', uptime: '12d 4h', cpu: 9, mem: 31 },
  { name: 'user-service', port: 8082, status: 'UP', uptime: '12d 4h', cpu: 7, mem: 28 },
  { name: 'product-service', port: 8083, status: 'DOWN', uptime: '—', cpu: 0, mem: 0 },
  { name: 'inventory-service', port: 8084, status: 'DOWN', uptime: '—', cpu: 0, mem: 0 },
  { name: 'sales-service', port: 8085, status: 'DOWN', uptime: '—', cpu: 0, mem: 0 },
  { name: 'reporting-service', port: 8086, status: 'DOWN', uptime: '—', cpu: 0, mem: 0 },
  { name: 'discovery-server', port: 8761, status: 'UP', uptime: '12d 4h', cpu: 5, mem: 22 },
]

export const shifts = [
  { id: 'SH-330', cashier: 'Nguyễn Văn A', open: '2026-06-15 07:55', close: '—', opening: 2000000, sales: 6480000, status: 'Đang mở' },
  { id: 'SH-329', cashier: 'Lê Văn C', open: '2026-06-14 14:00', close: '2026-06-14 22:05', opening: 2000000, sales: 9120000, status: 'Đã đóng' },
  { id: 'SH-328', cashier: 'Nguyễn Văn A', open: '2026-06-14 07:50', close: '2026-06-14 14:00', opening: 2000000, sales: 7640000, status: 'Đã đóng' },
]

export const recentSales = [
  { id: 'INV-20260615-0098', time: '09:41', cashier: 'Nguyễn Văn A', items: 6, total: 648000, payment: 'Tiền mặt' },
  { id: 'INV-20260615-0097', time: '09:36', cashier: 'Nguyễn Văn A', items: 2, total: 96000, payment: 'Thẻ' },
  { id: 'INV-20260615-0096', time: '09:28', cashier: 'Nguyễn Văn A', items: 11, total: 1240000, payment: 'Ví điện tử' },
  { id: 'INV-20260615-0095', time: '09:15', cashier: 'Nguyễn Văn A', items: 3, total: 210000, payment: 'Tiền mặt' },
]

// ---- chart datasets ----
export const salesTrend = [
  { day: 'T2', revenue: 42, orders: 180 },
  { day: 'T3', revenue: 38, orders: 165 },
  { day: 'T4', revenue: 51, orders: 210 },
  { day: 'T5', revenue: 47, orders: 198 },
  { day: 'T6', revenue: 63, orders: 240 },
  { day: 'T7', revenue: 78, orders: 312 },
  { day: 'CN', revenue: 69, orders: 280 },
]

export const categoryShare = [
  { name: 'Đồ uống', value: 32 },
  { name: 'Thực phẩm khô', value: 28 },
  { name: 'Gia vị', value: 16 },
  { name: 'Hóa phẩm', value: 14 },
  { name: 'Thực phẩm tươi', value: 10 },
]

export const employeePerf = [
  { name: 'Nguyễn Văn A', sales: 142, accuracy: 99.2, hours: 168, score: 92 },
  { name: 'Lê Văn C', sales: 118, accuracy: 98.1, hours: 160, score: 86 },
  { name: 'Trần Thị B', sales: 0, accuracy: 99.8, hours: 172, score: 90 },
  { name: 'Phạm Thị D', sales: 0, accuracy: 100, hours: 176, score: 95 },
]

export const monthlyRevenue = [
  { month: 'T1', revenue: 980, target: 1000 },
  { month: 'T2', revenue: 1120, target: 1050 },
  { month: 'T3', revenue: 1040, target: 1100 },
  { month: 'T4', revenue: 1260, target: 1150 },
  { month: 'T5', revenue: 1340, target: 1250 },
  { month: 'T6', revenue: 880, target: 1300 },
]
