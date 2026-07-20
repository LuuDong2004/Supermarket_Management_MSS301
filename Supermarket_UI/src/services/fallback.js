// Documentation/demo fixtures.  They keep the UI populated when the gateway
// is offline; set VITE_USE_MOCK=false to use the real services only.
const products = [
  { id: 'P001', barcode: '8930001', name: 'Sữa tươi Vinamilk 1L', category: 'Đồ uống', price: 32000, cost: 26000, stock: 120, unit: 'hộp', expiry: '2026-09-12' },
  { id: 'P002', barcode: '8930002', name: 'Gạo ST25 5kg', category: 'Thực phẩm khô', price: 165000, cost: 140000, stock: 64, unit: 'túi', expiry: '2027-01-20' },
  { id: 'P003', barcode: '8930003', name: 'Dầu ăn Neptune 1L', category: 'Gia vị', price: 48000, cost: 41000, stock: 9, unit: 'chai', expiry: '2026-11-05' },
  { id: 'P004', barcode: '8930004', name: 'Mì Hảo Hảo (thùng 30)', category: 'Thực phẩm khô', price: 115000, cost: 98000, stock: 210, unit: 'thùng', expiry: '2026-07-01' },
  { id: 'P005', barcode: '8930005', name: 'Nước ngọt Coca 1.5L', category: 'Đồ uống', price: 18000, cost: 14000, stock: 8, unit: 'chai', expiry: '2026-06-28' },
  { id: 'P006', barcode: '8930006', name: 'Trứng gà hộp 10', category: 'Thực phẩm tươi', price: 35000, cost: 28000, stock: 45, unit: 'hộp', expiry: '2026-06-22' },
  { id: 'P007', barcode: '8930007', name: 'Bột giặt Omo 3kg', category: 'Hóa phẩm', price: 92000, cost: 78000, stock: 38, unit: 'túi', expiry: '2028-03-01' },
  { id: 'P008', barcode: '8930008', name: 'Nước mắm Nam Ngư 500ml', category: 'Gia vị', price: 28000, cost: 22000, stock: 7, unit: 'chai', expiry: '2027-05-15' },
]

const customers = [
  { id: 'C001', name: 'Trần Thị Mai', phone: '0901234567', tier: 'Gold', points: 1240, joined: '2024-03-11', spent: 12400000 },
  { id: 'C002', name: 'Nguyễn Văn Hùng', phone: '0912345678', tier: 'Silver', points: 430, joined: '2025-01-20', spent: 4300000 },
  { id: 'C003', name: 'Lê Hoàng Anh', phone: '0987654321', tier: 'Member', points: 85, joined: '2026-02-02', spent: 850000 },
  { id: 'C004', name: 'Phạm Thu Hà', phone: '0934567890', tier: 'Platinum', points: 5210, joined: '2023-08-15', spent: 52100000 },
]

const vouchers = [
  { code: 'WELCOME10', type: 'percent', value: 10, min: 100000, label: 'Giảm 10% đơn từ 100k' },
  { code: 'SALE50K', type: 'amount', value: 50000, min: 500000, label: 'Giảm 50k đơn từ 500k' },
]

const promotions = [
  { id: 'PR01', name: 'Tuần lễ đồ uống', scope: 'Đồ uống', discount: 15, type: 'percent', from: '2026-06-10', to: '2026-06-20', status: 'Đang chạy' },
  { id: 'PR02', name: 'Mua 2 tặng 1 mì gói', scope: 'Mì Hảo Hảo', discount: 33, type: 'percent', from: '2026-06-01', to: '2026-06-30', status: 'Đang chạy' },
  { id: 'PR03', name: 'Cuối tuần vàng', scope: 'Toàn bộ', discount: 5, type: 'percent', from: '2026-06-21', to: '2026-06-22', status: 'Lên lịch' },
]

const suppliers = [
  { id: 'S001', name: 'Công ty Vinamilk', contact: 'Mr. Bình', phone: '02838100888', rating: 4.8, status: 'Active', terms: 'NET 30' },
  { id: 'S002', name: 'Masan Consumer', contact: 'Ms. Lan', phone: '02839100999', rating: 4.5, status: 'Active', terms: 'NET 45' },
  { id: 'S003', name: 'Acecook Việt Nam', contact: 'Mr. Tâm', phone: '02837100111', rating: 4.2, status: 'Active', terms: 'NET 30' },
  { id: 'S004', name: 'Unilever VN', contact: 'Ms. Hoa', phone: '02835100222', rating: 4.6, status: 'On hold', terms: 'NET 60' },
]

const purchaseOrders = [
  { id: 'PO-2026-041', code: 'PO-2026-041', supplier: 'Công ty Vinamilk', orderDate: '2026-06-12', date: '2026-06-12', items: 8, total: 18600000, status: 'Pending', approval: 'Chờ duyệt' },
  { id: 'PO-2026-040', code: 'PO-2026-040', supplier: 'Acecook Việt Nam', orderDate: '2026-06-11', date: '2026-06-11', items: 4, total: 9200000, status: 'Approved', approval: 'Đã duyệt' },
  { id: 'PO-2026-039', code: 'PO-2026-039', supplier: 'Masan Consumer', orderDate: '2026-06-09', date: '2026-06-09', items: 12, total: 24500000, status: 'Received', approval: 'Đã duyệt' },
  { id: 'PO-2026-038', code: 'PO-2026-038', supplier: 'Unilever VN', orderDate: '2026-06-07', date: '2026-06-07', items: 6, total: 13100000, status: 'Rejected', approval: 'Từ chối' },
]

const warehouseTxns = [
  { id: 'WT-1042', type: 'Nhập kho', ref: 'PO-2026-040', product: 'Mì Hảo Hảo', qty: 50, date: '2026-06-13', status: 'Chờ duyệt' },
  { id: 'WT-1041', type: 'Xuất kho', ref: 'SO-9921', product: 'Sữa Vinamilk', qty: -30, date: '2026-06-13', status: 'Chờ duyệt' },
  { id: 'WT-1040', type: 'Điều chỉnh', ref: 'ADJ-220', product: 'Trứng gà', qty: -5, date: '2026-06-12', status: 'Đã duyệt' },
  { id: 'WT-1039', type: 'Nhập kho', ref: 'PO-2026-039', product: 'Nước mắm Nam Ngư', qty: 100, date: '2026-06-11', status: 'Đã duyệt' },
]

const inventory = products.map((p) => ({ id: p.id, product: p.name, productName: p.name, sku: p.barcode, onHand: p.stock, stock: p.stock, threshold: p.stock < 10 ? 10 : 20, unit: p.unit, value: p.stock * p.cost, expiry: p.expiry, status: p.stock < 10 ? 'Low stock' : 'Ổn định' }))
const stockAdjustments = [
  { id: 'ADJ-221', product: 'Dầu ăn Neptune', system: 12, counted: 9, diff: -3, reason: 'Hư hỏng', date: '2026-06-13', status: 'Chờ duyệt' },
  { id: 'ADJ-220', product: 'Trứng gà hộp 10', system: 50, counted: 45, diff: -5, reason: 'Vỡ', date: '2026-06-12', status: 'Đã duyệt' },
  { id: 'ADJ-219', product: 'Coca 1.5L', system: 10, counted: 8, diff: -2, reason: 'Thất thoát', date: '2026-06-10', status: 'Từ chối' },
]
const stockCounts = [{ id: 'SC-001', warehouse: 'Kho trung tâm', countDate: '2026-06-15', status: 'Đang kiểm kê', totalItems: 128, countedItems: 96 }]

const employees = [
  { id: 'E001', name: 'Nguyễn Văn A', employeeName: 'Nguyễn Văn A', role: 'ROLE_CASHIER', dept: 'Thu ngân', joined: '2024-05-01', phone: '0901111222', status: 'Đang làm', salary: 8500000 },
  { id: 'E002', name: 'Trần Thị B', employeeName: 'Trần Thị B', role: 'ROLE_WAREHOUSE', dept: 'Kho', joined: '2023-11-15', phone: '0902222333', status: 'Đang làm', salary: 9200000 },
  { id: 'E003', name: 'Lê Văn C', employeeName: 'Lê Văn C', role: 'ROLE_CASHIER', dept: 'Thu ngân', joined: '2025-02-10', phone: '0903333444', status: 'Đang làm', salary: 8000000 },
  { id: 'E004', name: 'Phạm Thị D', employeeName: 'Phạm Thị D', role: 'ROLE_ADMIN', dept: 'Quản trị', joined: '2022-07-20', phone: '0904444555', status: 'Đang làm', salary: 14000000 },
]
const attendance = [
  { id: 'AT1', employee: 'Nguyễn Văn A', date: '2026-06-15', in: '07:55', out: '16:05', hours: 8, status: 'Đúng giờ' },
  { id: 'AT2', employee: 'Trần Thị B', date: '2026-06-15', in: '08:10', out: '17:00', hours: 8, status: 'Đi muộn' },
  { id: 'AT3', employee: 'Lê Văn C', date: '2026-06-15', in: '—', out: '—', hours: 0, status: 'Vắng' },
]

const approvalRequests = [
  { id: 'AR-501', type: 'Tạo tài khoản', requester: 'Phạm Thị D (Admin)', target: 'User: cashier_le', date: '2026-06-14', status: 'Chờ duyệt', note: 'Thêm thu ngân ca tối' },
  { id: 'AR-500', type: 'Thay đổi quyền', requester: 'Phạm Thị D (Admin)', target: 'User: tranb → Warehouse Mgr', date: '2026-06-13', status: 'Chờ duyệt', note: 'Đề xuất thăng chức' },
  { id: 'AR-499', type: 'Điều chỉnh kho', requester: 'Trần Thị B (Warehouse)', target: 'ADJ-221', date: '2026-06-13', status: 'Chờ duyệt', note: 'Dầu ăn hư hỏng 3 chai' },
  { id: 'AR-498', type: 'Chính sách giá', requester: 'CEO Office', target: 'PR03 Cuối tuần vàng', date: '2026-06-12', status: 'Đã duyệt', note: '' },
]
const policies = [
  { id: 'BP01', name: 'Hạn mức giảm giá thu ngân', value: '≤ 10%', category: 'Bán hàng', updated: '2026-05-30' },
  { id: 'BP02', name: 'Ngưỡng cảnh báo tồn kho thấp', value: '10 đơn vị', category: 'Kho', updated: '2026-06-01' },
  { id: 'BP03', name: 'Cảnh báo cận hạn sử dụng', value: '30 ngày', category: 'Kho', updated: '2026-06-01' },
  { id: 'BP04', name: 'Tỷ lệ tích điểm thành viên', value: '1đ / 10.000đ', category: 'Thành viên', updated: '2026-04-15' },
]
const settings = [
  { id: 'SET-01', settingKey: 'store.name', settingValue: 'SMS Central', label: 'Tên siêu thị', category: 'Chung' },
  { id: 'SET-02', settingKey: 'tax.vat', settingValue: '8%', label: 'Thuế VAT', category: 'Thuế' },
  { id: 'SET-03', settingKey: 'loyalty.rate', settingValue: '1 / 10000', label: 'Tỷ lệ tích điểm', category: 'Chung' },
]
const users = [
  { id: 'U001', username: 'ceo', fullName: 'Nguyễn Văn A', role: 'ROLE_CEO', status: 'ACTIVE', email: 'ceo@sms.local' },
  { id: 'U002', username: 'admin', fullName: 'Phạm Thị D', role: 'ROLE_ADMIN', status: 'ACTIVE', email: 'admin@sms.local' },
  { id: 'U003', username: 'cashier', fullName: 'Lê Văn C', role: 'ROLE_CASHIER', status: 'ACTIVE', email: 'cashier@sms.local' },
]
const shifts = [
  { id: 'SH-330', cashier: 'Nguyễn Văn A', open: '2026-06-15 07:55', close: '—', opening: 2000000, sales: 6480000, status: 'Đang mở' },
  { id: 'SH-329', cashier: 'Lê Văn C', open: '2026-06-14 14:00', close: '2026-06-14 22:05', opening: 2000000, sales: 9120000, status: 'Đã đóng' },
]
const sales = [
  { id: 'INV-20260615-0098', code: 'INV-20260615-0098', saleTime: '09:41', cashier: 'Nguyễn Văn A', items: 6, total: 648000, payment: 'Tiền mặt' },
  { id: 'INV-20260615-0097', code: 'INV-20260615-0097', saleTime: '09:36', cashier: 'Nguyễn Văn A', items: 2, total: 96000, payment: 'Thẻ' },
  { id: 'INV-20260615-0096', code: 'INV-20260615-0096', saleTime: '09:28', cashier: 'Nguyễn Văn A', items: 11, total: 1240000, payment: 'Ví điện tử' },
]

const salesTrend = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((label, i) => ({ label, day: label, revenue: [42, 38, 51, 47, 63, 78, 69][i], orders: [180, 165, 210, 198, 240, 312, 280][i] }))
const categoryShare = [{ name: 'Đồ uống', value: 32 }, { name: 'Thực phẩm khô', value: 28 }, { name: 'Gia vị', value: 16 }, { name: 'Hóa phẩm', value: 14 }, { name: 'Thực phẩm tươi', value: 10 }]
const monthlyRevenue = [{ month: 'T1', revenue: 980, target: 1000 }, { month: 'T2', revenue: 1120, target: 1050 }, { month: 'T3', revenue: 1040, target: 1100 }, { month: 'T4', revenue: 1260, target: 1150 }, { month: 'T5', revenue: 1340, target: 1250 }, { month: 'T6', revenue: 880, target: 1300 }]
const employeePerformance = employees.map((e, i) => ({ name: e.name, employee: e.name, sales: [142, 118, 0, 0][i], accuracy: [99.2, 98.1, 99.8, 100][i], hours: [168, 160, 172, 176][i], score: [92, 86, 90, 95][i] }))
const serviceRows = ['api-gateway', 'auth-service', 'user-service', 'product-service'].map((name, i) => ({ name, port: 8080 + i, status: i === 3 ? 'DOWN' : 'UP', uptime: i === 3 ? '—' : '12d 4h', cpu: 7 + i, mem: 28 + i * 3 }))
const systemLogs = [{ id: 'L9001', time: '2026-06-15 09:42:11', level: 'INFO', service: 'auth-service', message: 'User ceo logged in', user: 'ceo' }, { id: 'L9000', time: '2026-06-15 09:40:03', level: 'WARN', service: 'inventory-service', message: 'Low stock alert', user: 'system' }]

const value = (data) => () => data.map((row) => ({ ...row }))
export const mockProducts = value(products)
export const mockCategories = value([{ id: 'CAT-01', name: 'Đồ uống', status: 'Active' }, { id: 'CAT-02', name: 'Thực phẩm khô', status: 'Active' }])
export const mockPromotions = value(promotions)
export const mockVouchers = value(vouchers)
export const mockInventory = value(inventory)
export const mockWarehouseTxns = value(warehouseTxns)
export const mockStockAdjustments = value(stockAdjustments)
export const mockStockCounts = value(stockCounts)
export const mockSales = value(sales)
export const mockShifts = value(shifts)
export const mockCustomers = value(customers)
export const mockSuppliers = value(suppliers)
export const mockPurchaseOrders = value(purchaseOrders)
export const mockEmployees = value(employees)
export const mockAttendance = value(attendance)
export const mockUsers = value(users)
export const mockApprovalRequests = value(approvalRequests)
export const mockPolicies = value(policies)
export const mockSettings = value(settings)
export const mockNotifications = value([{ id: 'N001', title: 'Có yêu cầu cần duyệt', message: 'PO-2026-041 đang chờ xử lý', read: false }])
export const mockSalesTrend = value(salesTrend)
export const mockCategoryShare = value(categoryShare)
export const mockEmployeePerformance = value(employeePerformance)
export const mockMonthlyRevenue = value(monthlyRevenue)
export const mockServices = value(serviceRows)
export const mockSystemLogs = value(systemLogs)
export const mockDashboard = () => ({ salesTrend: salesTrend.map((x) => ({ ...x })), categoryShare: categoryShare.map((x) => ({ ...x })), monthlyRevenue: monthlyRevenue.map((x) => ({ ...x })) })
