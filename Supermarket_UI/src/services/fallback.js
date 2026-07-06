// Offline demo fallbacks. These reshape the legacy mock rows (src/mock/db.js)
// into the SAME field names the backend DTOs use, so a page can render one
// consistent shape whether the data came from the API or from this fallback.
//
// Pages pass these to `withFallback(call, mockX)` — the network path is primary,
// this is only used when the backend is unreachable.

import * as db from '../mock/db.js'

export const mockProducts = () =>
  db.products.map((p) => ({ ...p, code: p.id }))

export const mockCategories = () =>
  [...new Set(db.products.map((p) => p.category))]

export const mockPromotions = () =>
  db.promotions.map((p) => ({
    ...p, code: p.id, fromDate: p.from, toDate: p.to,
  }))

export const mockVouchers = () =>
  db.vouchers.map((v) => ({ ...v, id: v.code, minSpend: v.min }))

export const mockInventory = () =>
  db.products.map((p) => ({
    id: p.id, code: p.id, productCode: p.id, name: p.name, category: p.category,
    onHand: p.stock, threshold: 10, location: 'Kho A', unit: p.unit,
  }))

export const mockWarehouseTxns = () =>
  db.warehouseTxns.map((t) => ({ ...t, code: t.id, txnDate: t.date }))

export const mockStockAdjustments = () =>
  db.stockAdjustments.map((a) => ({
    ...a, code: a.id, systemQty: a.system, countedQty: a.counted, adjDate: a.date,
  }))

export const mockStockCounts = () => [
  { id: 'SC-01', code: 'SC-01', location: 'Kho A', status: 'Đang kiểm', countDate: '2026-06-15', note: 'Kiểm kê định kỳ' },
  { id: 'SC-02', code: 'SC-02', location: 'Kho B', status: 'Hoàn tất', countDate: '2026-06-10', note: '' },
]

export const mockSales = () =>
  db.recentSales.map((s) => ({ ...s, code: s.id, saleTime: s.time }))

export const mockShifts = () =>
  db.shifts.map((s) => ({ ...s, code: s.id, openAt: s.open, closeAt: s.close }))

export const mockCustomers = () =>
  db.customers.map((c) => ({ ...c, code: c.id }))

export const mockSuppliers = () =>
  db.suppliers.map((s) => ({ ...s, code: s.id }))

export const mockPurchaseOrders = () =>
  db.purchaseOrders.map((po) => ({ ...po, code: po.id, orderDate: po.date }))

export const mockEmployees = () =>
  db.employees.map((e) => ({ ...e, code: e.id }))

export const mockAttendance = () =>
  db.attendance.map((a) => ({ ...a, code: a.id, checkIn: a.in, checkOut: a.out }))

export const mockUsers = () =>
  db.employees.map((e, i) => ({
    id: e.id,
    username: e.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 8) || `user${i}`,
    fullName: e.name,
    role: e.role,
    status: 'ACTIVE',
    approval: 'APPROVED',
  }))

export const mockApprovalRequests = () =>
  db.approvalRequests.map((r) => ({ ...r, code: r.id, reqDate: r.date }))

export const mockPolicies = () =>
  db.businessPolicies.map((p) => ({ ...p, code: p.id, updatedDate: p.updated }))

export const mockSettings = () => [
  { id: 'ST01', settingKey: 'store.name', settingValue: 'Siêu thị MSS301', label: 'Tên cửa hàng', category: 'Chung' },
  { id: 'ST02', settingKey: 'currency', settingValue: 'VND', label: 'Đơn vị tiền tệ', category: 'Chung' },
  { id: 'ST03', settingKey: 'low.stock.threshold', settingValue: '10', label: 'Ngưỡng tồn kho thấp', category: 'Kho' },
]

export const mockNotifications = () => [
  { id: 'N01', title: 'Tồn kho thấp', message: 'Dầu ăn Neptune còn 9', level: 'WARN', recipient: 'warehouse', readFlag: false },
  { id: 'N02', title: 'Đơn mua chờ duyệt', message: 'PO-2026-041 cần phê duyệt', level: 'INFO', recipient: 'ceo', readFlag: false },
]

// ---- reporting / monitoring ----
export const mockSalesTrend = () =>
  db.salesTrend.map((d) => ({ label: d.day, revenue: d.revenue, orders: d.orders }))

export const mockCategoryShare = () => db.categoryShare
export const mockEmployeePerformance = () => db.employeePerf
export const mockMonthlyRevenue = () => db.monthlyRevenue
export const mockServices = () => db.services
export const mockSystemLogs = () =>
  db.systemLogs.map((l) => ({ ...l, actor: l.user }))

export const mockDashboard = () => ({
  salesTrend: mockSalesTrend(),
  categoryShare: db.categoryShare,
  monthlyRevenue: db.monthlyRevenue,
})
