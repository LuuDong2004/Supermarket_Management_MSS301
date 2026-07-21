import {
  LayoutDashboard, ShoppingCart, Users, BadgePercent,
  Gift, Package, PackagePlus, ClipboardList, ClipboardCheck, AlertTriangle, Boxes,
  ScanLine, Warehouse, FileBarChart, BarChart3, UserCog, ShieldCheck, ScrollText,
  Activity, Settings, BookCheck, Building2, CalendarCheck, Award, FileCheck2, Receipt,
  Wallet, Gauge, Lightbulb, KeyRound, ShieldAlert, Bell,
  PackageSearch, FileInput, Barcode, Undo2, CalendarClock, Truck,
} from 'lucide-react'

const ALL = ['ROLE_CEO', 'ROLE_ADMIN', 'ROLE_CASHIER', 'ROLE_WAREHOUSE_MANAGER', 'ROLE_WAREHOUSE_STAFF', 'ROLE_STAFF_MANAGER']

// Warehouse split: the Manager governs (orders, approvals, oversight, products,
// suppliers); the Staff operates (receiving, counting, adjustments, labels).
const WH_MANAGER = ['ROLE_WAREHOUSE_MANAGER']
const WH_STAFF = ['ROLE_WAREHOUSE_STAFF']

// Navigation model. Each group is shown if the current role matches any item.
// `roles` controls both menu visibility and route guarding.
export const NAV = [
  {
    section: null,
    items: [
      { to: '/app/dashboard', label: 'Tổng quan', icon: LayoutDashboard, roles: ALL },
    ],
  },
  {
    section: 'Bán hàng (POS)',
    items: [
      { to: '/app/pos/sale', label: 'Bán hàng / Thanh toán', icon: ShoppingCart, roles: ['ROLE_CASHIER'], code: '3.8.1' },
      { to: '/app/pos/payment', label: 'Thanh toán', icon: Wallet, roles: ['ROLE_CASHIER'], code: '3.8.2' },
      { to: '/app/pos/returns', label: 'Trả hàng / Hoàn tiền', icon: Undo2, roles: ['ROLE_CASHIER'], code: '3.8.4' },
      { to: '/app/pos/cancel-sales', label: 'Cancel Sales Order', icon: Undo2, roles: ['ROLE_CASHIER'], code: '3.8.5' },
      { to: '/app/pos/shift', label: 'Ca thu ngân', icon: Receipt, roles: ['ROLE_CASHIER'], code: '3.8.3' },
      { to: '/app/pos/members', label: 'Khách hàng thành viên', icon: Users, roles: ['ROLE_CASHIER'], code: '3.9.1' },
      { to: '/app/pos/loyalty', label: 'Điểm thưởng', icon: Gift, roles: ['ROLE_CASHIER'], code: '3.9.2' },
      { to: '/app/pos/promotions', label: 'Khuyến mãi & Voucher', icon: BadgePercent, roles: ['ROLE_CASHIER'], code: '3.9.3' },
    ],
  },
  {
    section: 'Kho hàng — Quản lý',
    items: [
      { to: '/app/warehouse/purchase-orders', label: 'Đơn mua hàng', icon: ClipboardList, roles: WH_MANAGER, code: '3.6.1' },
      { to: '/app/warehouse/transactions', label: 'Duyệt giao dịch kho', icon: ClipboardCheck, roles: WH_MANAGER, code: '3.6.2' },
      { to: '/app/warehouse/monitor', label: 'Giám sát tồn kho', icon: AlertTriangle, roles: WH_MANAGER, code: '3.6.3' },
      { to: '/app/warehouse/reports', label: 'Báo cáo kho', icon: Warehouse, roles: WH_MANAGER, code: '3.6.4' },
      { to: '/app/warehouse/products', label: 'Quản lý sản phẩm', icon: PackageSearch, roles: WH_MANAGER, code: '3.6.5' },
      { to: '/app/warehouse/categories', label: 'Category Management', icon: Boxes, roles: WH_MANAGER, code: '3.6.6' },
      { to: '/app/warehouse/suppliers', label: 'Nhà cung cấp', icon: Truck, roles: WH_MANAGER, code: '3.6.6' },
    ],
  },
  {
    section: 'Kho hàng — Vận hành',
    items: [
      { to: '/app/warehouse/receive', label: 'Nhận hàng', icon: PackagePlus, roles: WH_STAFF, code: '3.7.1' },
      { to: '/app/warehouse/inventory', label: 'Thông tin tồn kho', icon: Boxes, roles: WH_STAFF, code: '3.7.2' },
      { to: '/app/warehouse/stock-count', label: 'Kiểm kê', icon: ScanLine, roles: WH_STAFF, code: '3.7.3' },
      { to: '/app/warehouse/adjustments', label: 'Điều chỉnh tồn kho', icon: Package, roles: WH_STAFF, code: '3.7.4' },
      { to: '/app/warehouse/approval-status', label: 'Trạng thái duyệt', icon: FileCheck2, roles: WH_STAFF, code: '3.7.5' },
      { to: '/app/warehouse/goods-receipts', label: 'Phiếu nhập kho', icon: FileInput, roles: WH_STAFF, code: '3.7.6' },
      { to: '/app/warehouse/barcode', label: 'In tem mã vạch', icon: Barcode, roles: WH_STAFF, code: '3.7.7' },
    ],
  },
  {
    section: 'Nhân sự',
    items: [
      { to: '/app/hr/employees', label: 'Hồ sơ nhân viên', icon: Building2, roles: ['ROLE_STAFF_MANAGER'], code: '3.5.1' },
      { to: '/app/hr/shifts', label: 'Phân ca nhân viên', icon: CalendarClock, roles: ['ROLE_STAFF_MANAGER'], code: '3.5.4' },
      { to: '/app/hr/attendance', label: 'Chấm công', icon: CalendarCheck, roles: ['ROLE_STAFF_MANAGER'], code: '3.5.2' },
      { to: '/app/hr/timesheet', label: 'Báo cáo chấm công', icon: ClipboardList, roles: ['ROLE_STAFF_MANAGER'], code: '3.5.5' },
      { to: '/app/hr/performance', label: 'Đánh giá hiệu suất', icon: Award, roles: ['ROLE_STAFF_MANAGER'], code: '3.5.3' },
    ],
  },
  {
    section: 'Quản trị',
    items: [
      { to: '/app/admin/users', label: 'Tài khoản người dùng', icon: UserCog, roles: ['ROLE_ADMIN'], code: '3.4.1' },
      { to: '/app/admin/approval-requests', label: 'Yêu cầu phê duyệt', icon: FileCheck2, roles: ['ROLE_ADMIN'], code: '3.4.2' },
      { to: '/app/admin/promotion-campaigns', label: 'Promotion Campaign', icon: BadgePercent, roles: ['ROLE_ADMIN'], code: '3.4.4' },
      { to: '/app/admin/monitoring', label: 'Giám sát hệ thống', icon: Activity, roles: ['ROLE_ADMIN'], code: '3.4.3' },
      { to: '/app/admin/permissions', label: 'Phân quyền', icon: KeyRound, roles: ['ROLE_ADMIN'], code: '3.4.4' },
      { to: '/app/admin/security-alerts', label: 'Cảnh báo bảo mật', icon: ShieldAlert, roles: ['ROLE_ADMIN'], code: '3.4.5' },
      { to: '/app/admin/notifications', label: 'Thông báo hệ thống', icon: Bell, roles: ['ROLE_ADMIN'], code: '3.4.6' },
    ],
  },
  {
    section: 'Điều hành (CEO)',
    items: [
      { to: '/app/ceo/reports', label: 'Báo cáo quản trị', icon: BarChart3, roles: ['ROLE_CEO'], code: '3.3.1' },
      { to: '/app/ceo/approvals', label: 'Phê duyệt', icon: ShieldCheck, roles: ['ROLE_CEO'], code: '3.3.2' },
      { to: '/app/ceo/policies', label: 'Chính sách kinh doanh', icon: BookCheck, roles: ['ROLE_CEO'], code: '3.3.3' },
      { to: '/app/ceo/promotions', label: 'Duyệt khuyến mãi', icon: BadgePercent, roles: ['ROLE_CEO'], code: '3.3.4' },
      { to: '/app/ceo/financial', label: 'Báo cáo tài chính', icon: Wallet, roles: ['ROLE_CEO'], code: '3.3.5' },
      { to: '/app/ceo/operational', label: 'Báo cáo vận hành', icon: Gauge, roles: ['ROLE_CEO'], code: '3.3.6' },
      { to: '/app/ceo/decisions', label: 'Quyết định chiến lược', icon: Lightbulb, roles: ['ROLE_CEO'], code: '3.3.7' },
    ],
  },
  {
    section: 'Báo cáo',
    items: [
      { to: '/app/reports/sales', label: 'Doanh thu & hiệu suất', icon: BarChart3, roles: ['ROLE_CEO', 'ROLE_WAREHOUSE_MANAGER', 'ROLE_STAFF_MANAGER'], code: '3.10.1' },
      { to: '/app/reports/inventory', label: 'Kho & Tồn kho', icon: FileBarChart, roles: ['ROLE_CEO', 'ROLE_WAREHOUSE_MANAGER'], code: '3.10.2' },
      { to: '/app/reports/employees', label: 'Hiệu suất nhân viên', icon: FileBarChart, roles: ['ROLE_CEO', 'ROLE_STAFF_MANAGER'], code: '3.10.3' },
    ],
  },
  {
    section: 'Hệ thống',
    items: [
      { to: '/app/settings/system', label: 'Cấu hình hệ thống', icon: Settings, roles: ['ROLE_CEO', 'ROLE_ADMIN'], code: '3.11.1' },
      { to: '/app/settings/rules', label: 'Quy tắc & Nhật ký kiểm toán', icon: ScrollText, roles: ['ROLE_CEO', 'ROLE_ADMIN'], code: '3.11.2' },
    ],
  },
]

// Flatten to a quick lookup of route → allowed roles for guarding.
export const ROUTE_ROLES = NAV.flatMap((g) => g.items).reduce((acc, it) => {
  acc[it.to] = it.roles
  return acc
}, {})

// Compact role rails used by the realistic screen captures. The full NAV
// model remains above for route authorization and deep links.
const REFERENCE_NAV = {
  ROLE_CEO: [['/app/dashboard', 'CEO Dashboard'], ['/app/ceo/reports', 'Reports'], ['/app/reports/sales', 'Sales Reports'], ['/app/reports/inventory', 'Inventory Reports'], ['/app/reports/employees', 'Employee Reports'], ['/app/ceo/approvals', 'Approvals'], ['/app/ceo/policies', 'Business Policies'], ['/app/settings/system', 'Configuration'], ['/app/settings/rules', 'Audit Logs']],
  ROLE_ADMIN: [['/app/dashboard', 'Admin Dashboard'], ['/app/admin/users', 'User Accounts'], ['/app/admin/approval-requests', 'Approval Requests'], ['/app/admin/promotion-campaigns', 'Promotion Campaign'], ['/app/admin/monitoring', 'System Monitoring'], ['/app/settings/system', 'Configuration'], ['/app/settings/rules', 'Audit Logs']],
  ROLE_STAFF_MANAGER: [['/app/dashboard', 'Staff Dashboard'], ['/app/hr/employees', 'Employees'], ['/app/hr/attendance', 'Attendance'], ['/app/hr/performance', 'Performance'], ['/app/reports/sales', 'Sales Reports'], ['/app/reports/employees', 'Employee Reports']],
  ROLE_WAREHOUSE_MANAGER: [['/app/dashboard', 'WM Dashboard'], ['/app/warehouse/purchase-orders', 'Purchase Orders'], ['/app/warehouse/transactions', 'Transaction Approval'], ['/app/warehouse/products', 'Product Management'], ['/app/warehouse/categories', 'Category Management'], ['/app/warehouse/suppliers', 'Supplier Management'], ['/app/warehouse/reports', 'Warehouse Reports'], ['/app/warehouse/monitor', 'Stock Monitoring'], ['/app/reports/sales', 'Sales Reports'], ['/app/reports/inventory', 'Inventory Reports']],
  ROLE_WAREHOUSE_STAFF: [['/app/dashboard', 'WS Dashboard'], ['/app/warehouse/receive', 'Receive Goods'], ['/app/warehouse/inventory', 'Inventory'], ['/app/warehouse/stock-count', 'Stock Count'], ['/app/warehouse/adjustments', 'Adjustment Request'], ['/app/warehouse/approval-status', 'Approval Status']],
  ROLE_CASHIER: [['/app/dashboard', 'Cashier Dashboard'], ['/app/pos/sale', 'Sales / Checkout'], ['/app/pos/returns', 'Return / Refund'], ['/app/pos/cancel-sales', 'Cancel Sales Order'], ['/app/pos/members', 'Membership'], ['/app/pos/payment', 'Payments'], ['/app/pos/shift', 'Shift']],
}

export function navForRole(role) {
  const routes = REFERENCE_NAV[role]
  if (!routes) return NAV.map((g) => ({ ...g, items: g.items.filter((it) => it.roles.includes(role)) })).filter((g) => g.items.length > 0)
  const lookup = new Map(NAV.flatMap((group) => group.items.map((item) => [item.to, item])))
  return [{ section: null, items: routes.map(([to, label]) => ({ ...lookup.get(to), ...(label ? { label } : {}) })) }]
}
