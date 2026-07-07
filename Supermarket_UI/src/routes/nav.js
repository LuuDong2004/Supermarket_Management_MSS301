import {
  LayoutDashboard, ShoppingCart, CreditCard, Users, BadgePercent,
  Gift, Package, PackagePlus, ClipboardList, ClipboardCheck, AlertTriangle, Boxes,
  ScanLine, Warehouse, FileBarChart, BarChart3, UserCog, ShieldCheck, ScrollText,
  Activity, Settings, BookCheck, Building2, CalendarCheck, Award, FileCheck2, Receipt,
} from 'lucide-react'

const ALL = ['ROLE_CEO', 'ROLE_ADMIN', 'ROLE_CASHIER', 'ROLE_WAREHOUSE', 'ROLE_WAREHOUSE_MANAGER', 'ROLE_WAREHOUSE_STAFF', 'ROLE_SUPPLIER']

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
      { to: '/app/pos/sale', label: 'Bán hàng / Thanh toán', icon: ShoppingCart, roles: ['ROLE_CASHIER', 'ROLE_ADMIN'], code: '3.8.1' },
      { to: '/app/pos/shift', label: 'Ca thu ngân', icon: Receipt, roles: ['ROLE_CASHIER', 'ROLE_ADMIN'], code: '3.8.3' },
      { to: '/app/pos/members', label: 'Khách hàng thành viên', icon: Users, roles: ['ROLE_CASHIER', 'ROLE_ADMIN'], code: '3.9.1' },
      { to: '/app/pos/loyalty', label: 'Điểm thưởng', icon: Gift, roles: ['ROLE_CASHIER', 'ROLE_ADMIN'], code: '3.9.2' },
      { to: '/app/pos/promotions', label: 'Khuyến mãi & Voucher', icon: BadgePercent, roles: ['ROLE_CASHIER', 'ROLE_ADMIN'], code: '3.9.3' },
    ],
  },
  {
    section: 'Kho hàng',
    items: [
      { to: '/app/warehouse/purchase-orders', label: 'Đơn mua hàng', icon: ClipboardList, roles: ['ROLE_WAREHOUSE', 'ROLE_WAREHOUSE_MANAGER', 'ROLE_WAREHOUSE_STAFF', 'ROLE_ADMIN', 'ROLE_SUPPLIER'], code: '3.6.1' },
      { to: '/app/warehouse/transactions', label: 'Duyệt giao dịch kho', icon: ClipboardCheck, roles: ['ROLE_WAREHOUSE', 'ROLE_WAREHOUSE_MANAGER', 'ROLE_WAREHOUSE_STAFF', 'ROLE_ADMIN'], code: '3.6.2' },
      { to: '/app/warehouse/monitor', label: 'Giám sát tồn kho', icon: AlertTriangle, roles: ['ROLE_WAREHOUSE', 'ROLE_WAREHOUSE_MANAGER', 'ROLE_WAREHOUSE_STAFF', 'ROLE_ADMIN'], code: '3.6.3' },
      { to: '/app/warehouse/reports', label: 'Báo cáo kho', icon: Warehouse, roles: ['ROLE_WAREHOUSE', 'ROLE_WAREHOUSE_MANAGER', 'ROLE_WAREHOUSE_STAFF', 'ROLE_ADMIN'], code: '3.6.4' },
      { to: '/app/warehouse/receive', label: 'Nhận hàng', icon: PackagePlus, roles: ['ROLE_WAREHOUSE', 'ROLE_WAREHOUSE_MANAGER', 'ROLE_WAREHOUSE_STAFF', 'ROLE_ADMIN'], code: '3.7.1' },
      { to: '/app/warehouse/inventory', label: 'Thông tin tồn kho', icon: Boxes, roles: ['ROLE_WAREHOUSE', 'ROLE_WAREHOUSE_MANAGER', 'ROLE_WAREHOUSE_STAFF', 'ROLE_ADMIN'], code: '3.7.2' },
      { to: '/app/warehouse/stock-count', label: 'Kiểm kê', icon: ScanLine, roles: ['ROLE_WAREHOUSE', 'ROLE_WAREHOUSE_MANAGER', 'ROLE_WAREHOUSE_STAFF', 'ROLE_ADMIN'], code: '3.7.3' },
      { to: '/app/warehouse/adjustments', label: 'Điều chỉnh tồn kho', icon: Package, roles: ['ROLE_WAREHOUSE', 'ROLE_WAREHOUSE_MANAGER', 'ROLE_WAREHOUSE_STAFF', 'ROLE_ADMIN'], code: '3.7.4' },
      { to: '/app/warehouse/approval-status', label: 'Trạng thái duyệt', icon: FileCheck2, roles: ['ROLE_WAREHOUSE', 'ROLE_WAREHOUSE_MANAGER', 'ROLE_WAREHOUSE_STAFF', 'ROLE_ADMIN'], code: '3.7.5' },
    ],
  },
  {
    section: 'Nhân sự',
    items: [
      { to: '/app/hr/employees', label: 'Hồ sơ nhân viên', icon: Building2, roles: ['ROLE_ADMIN', 'ROLE_CEO'], code: '3.5.1' },
      { to: '/app/hr/attendance', label: 'Chấm công', icon: CalendarCheck, roles: ['ROLE_ADMIN', 'ROLE_CEO'], code: '3.5.2' },
      { to: '/app/hr/performance', label: 'Đánh giá hiệu suất', icon: Award, roles: ['ROLE_ADMIN', 'ROLE_CEO'], code: '3.5.3' },
    ],
  },
  {
    section: 'Quản trị',
    items: [
      { to: '/app/admin/users', label: 'Tài khoản người dùng', icon: UserCog, roles: ['ROLE_ADMIN'], code: '3.4.1' },
      { to: '/app/admin/approval-requests', label: 'Yêu cầu phê duyệt', icon: FileCheck2, roles: ['ROLE_ADMIN'], code: '3.4.2' },
      { to: '/app/admin/monitoring', label: 'Giám sát hệ thống', icon: Activity, roles: ['ROLE_ADMIN'], code: '3.4.3' },
    ],
  },
  {
    section: 'Điều hành (CEO)',
    items: [
      { to: '/app/ceo/reports', label: 'Báo cáo quản trị', icon: BarChart3, roles: ['ROLE_CEO'], code: '3.3.1' },
      { to: '/app/ceo/approvals', label: 'Phê duyệt', icon: ShieldCheck, roles: ['ROLE_CEO'], code: '3.3.2' },
      { to: '/app/ceo/policies', label: 'Chính sách kinh doanh', icon: BookCheck, roles: ['ROLE_CEO'], code: '3.3.3' },
    ],
  },
  {
    section: 'Báo cáo',
    items: [
      { to: '/app/reports/sales', label: 'Doanh thu & Kinh doanh', icon: FileBarChart, roles: ['ROLE_CEO', 'ROLE_ADMIN'], code: '3.10.1' },
      { to: '/app/reports/inventory', label: 'Kho & Tồn kho', icon: FileBarChart, roles: ['ROLE_CEO', 'ROLE_ADMIN', 'ROLE_WAREHOUSE', 'ROLE_WAREHOUSE_MANAGER', 'ROLE_WAREHOUSE_STAFF'], code: '3.10.2' },
      { to: '/app/reports/employees', label: 'Hiệu suất nhân viên', icon: FileBarChart, roles: ['ROLE_CEO', 'ROLE_ADMIN'], code: '3.10.3' },
    ],
  },
  {
    section: 'Hệ thống',
    items: [
      { to: '/app/settings/system', label: 'Cấu hình hệ thống', icon: Settings, roles: ['ROLE_ADMIN', 'ROLE_CEO'], code: '3.11.1' },
      { to: '/app/settings/rules', label: 'Quy tắc & Nhật ký kiểm toán', icon: ScrollText, roles: ['ROLE_ADMIN', 'ROLE_CEO'], code: '3.11.2' },
    ],
  },
]

// Flatten to a quick lookup of route → allowed roles for guarding.
export const ROUTE_ROLES = NAV.flatMap((g) => g.items).reduce((acc, it) => {
  acc[it.to] = it.roles
  return acc
}, {})

export function navForRole(role) {
  return NAV.map((g) => ({
    ...g,
    items: g.items.filter((it) => it.roles.includes(role)),
  })).filter((g) => g.items.length > 0)
}
